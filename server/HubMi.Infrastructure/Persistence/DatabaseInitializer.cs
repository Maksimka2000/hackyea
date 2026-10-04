using HubMi.Infrastructure.Identity;
using HubMi.Infrastructure.Imports.Adapters;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace HubMi.Infrastructure.Persistence;

/// <summary>
/// Startup work with real effect: migrate the schema, seed the sample library and starter knowledge into an empty database,
/// and create the demo accounts.
/// </summary>
internal sealed class DatabaseInitializer(
    IServiceScopeFactory scopeFactory,
    IOptions<PersistenceOptions> options,
    TimeProvider clock,
    ILogger<DatabaseInitializer> logger) : IHostedService
{
    private static readonly string SampleLibraryPath =
        Path.Combine(AppContext.BaseDirectory, "Imports", "SampleData", "library.json");

    private static readonly string SampleKnowledgePath =
        Path.Combine(AppContext.BaseDirectory, "Imports", "SampleData", "knowledge.json");

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        await using var scope = scopeFactory.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<HubMiDbContext>();

        if (options.Value.MigrateOnStartup)
        {
            await db.Database.MigrateAsync(cancellationToken);
            logger.LogInformation("Database migrations applied.");
        }

        if (options.Value.SeedSampleLibrary && !await db.Innovations.AnyAsync(cancellationToken))
            await SeedAsync(db, cancellationToken);

        if (options.Value.SeedSampleLibrary && !await db.Challenges.AnyAsync(cancellationToken) && !await db.Materials.AnyAsync(cancellationToken))
            await SeedKnowledgeAsync(db, cancellationToken);

        if (options.Value.SeedIdentity)
            await scope.ServiceProvider.GetRequiredService<DemoAccountSeeder>().SeedAsync(cancellationToken);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;

    private async Task SeedAsync(HubMiDbContext db, CancellationToken cancellationToken)
    {
        await using var file = File.OpenRead(SampleLibraryPath);
        var library = await new RopsLibraryJsonAdapter().ReadAsync(file, clock.GetUtcNow().UtcDateTime, cancellationToken);

        db.InnovationCategories.AddRange(library.Categories);
        db.Innovations.AddRange(library.Innovations);
        await db.SaveChangesAsync(cancellationToken);

        logger.LogInformation(
            "Seeded {Categories} categories and {Innovations} innovations.", library.Categories.Count, library.Innovations.Count);
    }

    private async Task SeedKnowledgeAsync(HubMiDbContext db, CancellationToken cancellationToken)
    {
        var categoryIds = (await db.InnovationCategories.Select(c => c.Id).ToListAsync(cancellationToken)).ToHashSet();
        await using var file = File.OpenRead(SampleKnowledgePath);
        var (challenges, materials) = await new KnowledgeJsonAdapter()
            .ReadAsync(file, categoryIds, clock.GetUtcNow().UtcDateTime, cancellationToken);

        db.Challenges.AddRange(challenges);
        db.Materials.AddRange(materials);
        await db.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Seeded {Challenges} challenges and {Materials} materials.", challenges.Count, materials.Count);
    }
}
