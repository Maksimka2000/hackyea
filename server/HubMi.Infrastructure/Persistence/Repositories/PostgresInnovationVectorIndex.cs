using HubMi.Features.Matching.Ports;
using HubMi.Features.Matching.Services;
using Microsoft.EntityFrameworkCore;
using Pgvector;
using Pgvector.EntityFrameworkCore;

namespace HubMi.Infrastructure.Persistence.Repositories;

/// <summary>
/// Meaning search in Postgres (pgvector): rows are ordered by cosine distance (<c>&lt;=&gt;</c>) to the query vector, which the HNSW
/// index on <c>innovation_embedding.vector</c> serves, and each card keeps its best row. Similarity is 1 - distance, the same scale as
/// the dot product of the normalized vectors, so the floor F keeps its meaning. Every API instance reads the same rows, so an edited
/// card is found by the next search everywhere.
/// </summary>
internal sealed class PostgresInnovationVectorIndex(HubMiDbContext db, ITextEmbedder embedder) : IInnovationVectorIndex
{
    public async Task<string?> GetVersionAsync(CancellationToken cancellationToken)
    {
        var model = embedder.ModelId;
        var rows = await db.InnovationEmbeddings
            .Where(e => e.Model == model)
            .GroupBy(_ => 1)
            .Select(g => new { Count = g.Count(), Latest = g.Max(e => e.UpdatedAt) })
            .FirstOrDefaultAsync(cancellationToken);
        if (rows is null)
            return null;

        // Publishing or unpublishing a card changes the results without touching a row.
        var cards = await db.Innovations
            .Where(i => i.IsPublished)
            .GroupBy(_ => 1)
            .Select(g => new { Count = g.Count(), Latest = g.Max(i => i.UpdatedAt) })
            .FirstOrDefaultAsync(cancellationToken);

        return $"{rows.Count}|{rows.Latest:O}|{cards?.Count}|{cards?.Latest:O}";
    }

    public async Task<IReadOnlyList<VectorHit>> SearchAsync(float[] query, int limit, CancellationToken cancellationToken)
    {
        var model = embedder.ModelId;
        var vector = new Vector(query);

        // A card has at most RowsPerCard rows, so this many nearest rows always hold at least `limit` different cards.
        var rows = await db.InnovationEmbeddings
            .AsNoTracking()
            .Where(e => e.Model == model && db.Innovations.Any(i => i.Id == e.InnovationId && i.IsPublished))
            .OrderBy(e => e.Vector.CosineDistance(vector))
            .Take(limit * PassageTextBuilder.RowsPerCard)
            .Select(e => new { e.InnovationId, e.Kind, Distance = e.Vector.CosineDistance(vector) })
            .ToListAsync(cancellationToken);

        // Rows arrive nearest first, so the first row of each card is its best one.
        return rows
            .GroupBy(r => r.InnovationId)
            .Select(g => g.First())
            .Select(r => new VectorHit(r.InnovationId, 1 - r.Distance, r.Kind))
            .OrderByDescending(h => h.Similarity)
            .ThenBy(h => h.InnovationId)
            .Take(limit)
            .ToList();
    }
}
