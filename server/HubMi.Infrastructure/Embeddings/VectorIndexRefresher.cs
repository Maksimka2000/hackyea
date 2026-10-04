using HubMi.Features.Matching.Ports;
using HubMi.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace HubMi.Infrastructure.Embeddings;

/// <summary>
/// Loads both models at startup (taking the reranker as a dependency makes the container build it, so the first question is not slow),
/// builds the meaning index in the background (the API starts answering immediately, with keyword search until it is ready) and then
/// watches for changed cards or vectors, so an edit made on any instance reaches every instance within the refresh interval.
/// </summary>
internal sealed class VectorIndexRefresher(
    IServiceScopeFactory scopeFactory,
    ITextEmbedder embedder,
    IReranker reranker,
    IOptions<EmbeddingOptions> options,
    ILogger<VectorIndexRefresher> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (!embedder.IsReady)
            return;

        string? lastSignature = null;
        using var timer = new PeriodicTimer(TimeSpan.FromSeconds(options.Value.RefreshSeconds));

        do
        {
            try
            {
                await using var scope = scopeFactory.CreateAsyncScope();
                var db = scope.ServiceProvider.GetRequiredService<HubMiDbContext>();

                if (await SignatureAsync(db, stoppingToken) != lastSignature)
                {
                    await scope.ServiceProvider.GetRequiredService<IInnovationIndexer>().ReindexAsync(null, stoppingToken);
                    lastSignature = await SignatureAsync(db, stoppingToken);
                }
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                // The database may still be starting or migrating; the next tick tries again.
                logger.LogWarning(ex, "Refreshing the meaning index failed; will retry.");
            }
        }
        while (await WaitAsync(timer, stoppingToken));
    }

    private static async Task<bool> WaitAsync(PeriodicTimer timer, CancellationToken cancellationToken)
    {
        try
        {
            return await timer.WaitForNextTickAsync(cancellationToken);
        }
        catch (OperationCanceledException)
        {
            return false;
        }
    }

    /// <summary>Changes whenever a published card is added, removed or edited, or a vector is written.</summary>
    private static async Task<string> SignatureAsync(HubMiDbContext db, CancellationToken cancellationToken)
    {
        var cards = await db.Innovations.Where(i => i.IsPublished).GroupBy(_ => 1)
            .Select(g => new { Count = g.Count(), Latest = g.Max(i => i.UpdatedAt) })
            .FirstOrDefaultAsync(cancellationToken);
        var vectors = await db.InnovationEmbeddings.GroupBy(_ => 1)
            .Select(g => new { Count = g.Count(), Latest = g.Max(e => e.UpdatedAt) })
            .FirstOrDefaultAsync(cancellationToken);

        return $"{cards?.Count}|{cards?.Latest:O}|{vectors?.Count}|{vectors?.Latest:O}";
    }
}
