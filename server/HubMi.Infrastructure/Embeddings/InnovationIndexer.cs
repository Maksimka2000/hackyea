using HubMi.Domain.Innovations;
using HubMi.Features.Matching.Ports;
using HubMi.Features.Matching.Services;
using HubMi.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pgvector;

namespace HubMi.Infrastructure.Embeddings;

/// <summary>
/// Keeps each card's rows (problem, solution) in step with its text: embeds the rows whose text or model changed and deletes rows
/// that no longer exist. The search reads the rows straight from Postgres, so nothing has to be reloaded afterwards.
/// </summary>
internal sealed class InnovationIndexer(
    HubMiDbContext db,
    ITextEmbedder embedder,
    TimeProvider clock,
    ILogger<InnovationIndexer> logger) : IInnovationIndexer
{
    private sealed record DesiredRow(string Kind, int Ordinal, string Text);

    public async Task ReindexAsync(Guid? innovationId, CancellationToken cancellationToken)
    {
        if (!embedder.IsReady)
            return;

        var cards = await db.Innovations
            .AsNoTracking()
            .Where(i => i.IsPublished && (innovationId == null || i.Id == innovationId))
            .ToListAsync(cancellationToken);

        var ids = cards.Select(c => c.Id).ToList();
        var stored = (await db.InnovationEmbeddings.Where(e => ids.Contains(e.InnovationId)).ToListAsync(cancellationToken))
            .ToLookup(e => e.InnovationId);

        var embedded = 0;
        var removed = 0;
        foreach (var card in cards)
        {
            var existing = stored[card.Id].ToDictionary(e => (e.Kind, e.Ordinal));
            var desired = DesiredRows(card);

            foreach (var row in desired)
            {
                var hash = PassageTextBuilder.Hash(row.Text);
                existing.Remove((row.Kind, row.Ordinal), out var current);
                if (current is not null && current.Model == embedder.ModelId && current.TextHash == hash)
                    continue;

                var vector = new Vector(await embedder.EmbedAsync(row.Text, cancellationToken));
                var now = clock.GetUtcNow().UtcDateTime;
                if (current is null)
                {
                    db.InnovationEmbeddings.Add(new InnovationEmbedding
                    {
                        InnovationId = card.Id, Kind = row.Kind, Ordinal = row.Ordinal, Model = embedder.ModelId,
                        Text = row.Text, TextHash = hash, Vector = vector, UpdatedAt = now
                    });
                }
                else
                {
                    current.Model = embedder.ModelId;
                    current.Text = row.Text;
                    current.TextHash = hash;
                    current.Vector = vector;
                    current.UpdatedAt = now;
                }

                embedded++;
            }

            // Whatever is left was a row of an older text (a card that lost its problem text).
            db.InnovationEmbeddings.RemoveRange(existing.Values);
            removed += existing.Count;

            // One save per card: a long first indexing keeps its progress if the app stops.
            if (db.ChangeTracker.HasChanges())
                await db.SaveChangesAsync(cancellationToken);
        }

        if (embedded > 0 || removed > 0)
            logger.LogInformation("Indexed {Embedded} row(s), removed {Removed}.", embedded, removed);
    }

    private List<DesiredRow> DesiredRows(Innovation card)
    {
        var rows = new List<DesiredRow>();

        var problem = PassageTextBuilder.BuildProblem(card);
        if (problem.Length > 0)
            rows.Add(new DesiredRow(PassageTextBuilder.ProblemKind, 0, problem));

        var solution = PassageTextBuilder.BuildSolution(card);
        if (solution.Length > 0)
            rows.Add(new DesiredRow(PassageTextBuilder.SolutionKind, 0, solution));

        return rows;
    }
}
