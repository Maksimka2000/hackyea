using HubMi.Domain.Innovations;
using HubMi.Features.Matching.Ports;
using Microsoft.EntityFrameworkCore;

namespace HubMi.Infrastructure.Persistence.Repositories;

/// <summary>
/// Card lookup by id, plus the keyword fallback: Postgres full-text retrieval over the generated <c>search_vector</c> column (GIN index).
/// Words are indexed accent-folded in the <c>simple</c> configuration; query prefixes (<c>samot:*</c>) match any inflection.
/// </summary>
internal sealed class PostgresInnovationSearch(HubMiDbContext db) : IInnovationSearch
{
    // ts_rank_cd weights in the order {D, C, B, A}; A = title/tagline, B = problems/target group, C = solution/beneficiaries.
    private static readonly float[] RankWeights = [0.1f, 0.4f, 0.7f, 1.0f];

    public async Task<IReadOnlyList<Innovation>> FindCandidatesAsync(
        IReadOnlyCollection<string> prefixes, int limit, CancellationToken cancellationToken)
    {
        if (prefixes.Count == 0)
            return [];

        var tsQuery = BuildTsQuery(prefixes);

        return await db.Innovations
            .FromSqlInterpolated($"""
                SELECT i.* FROM innovation i
                WHERE i.is_published AND i.search_vector @@ to_tsquery('simple', {tsQuery})
                ORDER BY ts_rank_cd({RankWeights}, i.search_vector, to_tsquery('simple', {tsQuery})) DESC, i.id
                LIMIT {limit}
                """)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Innovation>> GetByIdsAsync(IReadOnlyCollection<Guid> ids, CancellationToken cancellationToken)
    {
        if (ids.Count == 0)
            return [];

        var wanted = ids.ToArray();
        return await db.Innovations
            .AsNoTracking()
            .Where(i => i.IsPublished && wanted.Contains(i.Id))
            .ToListAsync(cancellationToken);
    }

    /// <summary>Prefixes are accent-folded lower-case letters/digits (produced by the analyzer), so they are safe inside a tsquery.</summary>
    private static string BuildTsQuery(IEnumerable<string> prefixes) =>
        string.Join(" | ", prefixes.Where(IsSafe).Select(p => p + ":*"));

    private static bool IsSafe(string prefix) =>
        prefix.Length > 0 && prefix.All(c => c is >= 'a' and <= 'z' or >= '0' and <= '9');
}
