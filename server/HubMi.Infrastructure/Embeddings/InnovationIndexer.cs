using HubMi.Domain.Innovations;
using HubMi.Features.Matching.Ports;
using HubMi.Features.Matching.Services;
using HubMi.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HubMi.Infrastructure.Embeddings;

/// <summary>
/// Keeps each card's rows (problem, solution, one per synthetic sentence) in step with its text: embeds the rows whose text or
/// model changed, deletes rows that no longer exist, and reloads the in-memory index from the database.
/// </summary>
internal sealed class InnovationIndexer(
    HubMiDbContext db,
    ITextEmbedder embedder,
    ISyntheticSentenceSource synthetic,
    InnovationVectorIndex index,
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

                var vector = await embedder.EmbedAsync(row.Text, cancellationToken);
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

            // Whatever is left was a row of an older text (a removed sentence, a card that lost its problem text).
            db.InnovationEmbeddings.RemoveRange(existing.Values);
            removed += existing.Count;

            // One save per card: a long first indexing keeps its progress if the app stops.
            if (db.ChangeTracker.HasChanges())
                await db.SaveChangesAsync(cancellationToken);
        }

        if (embedded > 0 || removed > 0)
            logger.LogInformation("Indexed {Embedded} row(s), removed {Removed}.", embedded, removed);

        await LoadIndexAsync(cancellationToken);
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

        var sentences = synthetic.For(card.SourceUrl);
        for (var i = 0; i < sentences.Count; i++)
            rows.Add(new DesiredRow(PassageTextBuilder.SyntheticKind, i, sentences[i]));

        return rows;
    }

    private async Task LoadIndexAsync(CancellationToken cancellationToken)
    {
        var model = embedder.ModelId;
        var rows = await db.InnovationEmbeddings
            .AsNoTracking()
            .Where(e => e.Model == model && db.Innovations.Any(i => i.Id == e.InnovationId && i.IsPublished))
            .Select(e => new { e.InnovationId, e.Kind, e.Vector })
            .ToListAsync(cancellationToken);

        index.Replace(rows.Select(r => (r.InnovationId, r.Kind, r.Vector)).ToList());
    }
}
