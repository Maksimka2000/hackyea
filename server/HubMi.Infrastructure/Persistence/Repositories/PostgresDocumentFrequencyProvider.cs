using System.Data;
using HubMi.Features.Matching.Ports;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Npgsql;

namespace HubMi.Infrastructure.Persistence.Repositories;

/// <summary>Document frequencies per prefix, cached briefly: they only change when cards are added or edited.</summary>
internal sealed class PostgresDocumentFrequencyProvider(HubMiDbContext db, IMemoryCache cache) : IDocumentFrequencyProvider
{
    private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(10);

    public async Task<CorpusStatistics> GetAsync(IReadOnlyCollection<string> prefixes, CancellationToken cancellationToken)
    {
        var total = await cache.GetOrCreateAsync("df:total", async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = CacheDuration;
            return await db.Innovations.CountAsync(i => i.IsPublished, cancellationToken);
        });

        var frequencies = new Dictionary<string, int>(StringComparer.Ordinal);
        var missing = new List<string>();

        foreach (var prefix in prefixes.Distinct(StringComparer.Ordinal))
        {
            if (cache.TryGetValue($"df:{prefix}", out int cached))
                frequencies[prefix] = cached;
            else
                missing.Add(prefix);
        }

        if (missing.Count > 0)
        {
            foreach (var (prefix, count) in await QueryAsync(missing, cancellationToken))
            {
                frequencies[prefix] = count;
                cache.Set($"df:{prefix}", count, CacheDuration);
            }
        }

        return new CorpusStatistics(total, frequencies);
    }

    private async Task<Dictionary<string, int>> QueryAsync(List<string> prefixes, CancellationToken cancellationToken)
    {
        var safe = prefixes.Where(p => p.Length > 0 && p.All(c => c is >= 'a' and <= 'z' or >= '0' and <= '9')).ToArray();
        var result = new Dictionary<string, int>(StringComparer.Ordinal);
        if (safe.Length == 0)
            return result;

        var connection = db.Database.GetDbConnection();
        var opened = connection.State != ConnectionState.Open;
        if (opened)
            await connection.OpenAsync(cancellationToken);

        try
        {
            await using var command = (NpgsqlCommand)connection.CreateCommand();
            command.CommandText = """
                SELECT t.stem, count(i.id)::int
                FROM unnest(@stems) AS t(stem)
                LEFT JOIN innovation i
                  ON i.is_published AND i.search_vector @@ to_tsquery('simple', t.stem || ':*')
                GROUP BY t.stem
                """;
            command.Parameters.Add(new NpgsqlParameter<string[]>("stems", safe));

            await using var reader = await command.ExecuteReaderAsync(cancellationToken);
            while (await reader.ReadAsync(cancellationToken))
                result[reader.GetString(0)] = reader.GetInt32(1);
        }
        finally
        {
            if (opened)
                await connection.CloseAsync();
        }

        return result;
    }
}
