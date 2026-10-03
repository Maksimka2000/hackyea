using HubMi.Domain.Innovations;
using HubMi.Features.Matching.Ports;
using Microsoft.EntityFrameworkCore;

namespace HubMi.Infrastructure.Persistence.Repositories;

/// <summary>
/// Postgres full-text retrieval over the generated <c>search_vector</c> column (GIN index).
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

    public async Task<IReadOnlyList<Innovation>> FindSimilarAsync(
        string text, IReadOnlyCollection<string> excludeIds, int limit, CancellationToken cancellationToken)
    {
        var exclude = excludeIds.ToArray();

        return await db.Innovations
            .FromSqlInterpolated($"""
                SELECT i.* FROM innovation i
                WHERE i.is_published AND NOT (i.id = ANY({exclude}))
                  AND word_similarity(hubmi_fold({text}), hubmi_fold(i.title || ' ' || coalesce(i.tagline, ''))) > 0.3
                ORDER BY word_similarity(hubmi_fold({text}), hubmi_fold(i.title || ' ' || coalesce(i.tagline, ''))) DESC, i.id
                LIMIT {limit}
                """)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Innovation>> GetFillersAsync(
        string? preferredCategoryId, IReadOnlyCollection<string> excludeIds, int limit, CancellationToken cancellationToken)
    {
        var exclude = excludeIds.ToArray();
        var preferred = preferredCategoryId ?? string.Empty;

        return await db.Innovations
            .FromSqlInterpolated($"""
                SELECT i.* FROM innovation i
                WHERE i.is_published AND NOT (i.id = ANY({exclude}))
                ORDER BY (i.category_id = {preferred}) DESC,
                         (SELECT count(*) FROM innovation x WHERE x.is_published AND x.category_id = i.category_id) DESC,
                         i.title, i.id
                LIMIT {limit}
                """)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    /// <summary>Prefixes are accent-folded lower-case letters/digits (produced by the analyzer), so they are safe inside a tsquery.</summary>
    private static string BuildTsQuery(IEnumerable<string> prefixes) =>
        string.Join(" | ", prefixes.Where(IsSafe).Select(p => p + ":*"));

    private static bool IsSafe(string prefix) =>
        prefix.Length > 0 && prefix.All(c => c is >= 'a' and <= 'z' or >= '0' and <= '9');
}
