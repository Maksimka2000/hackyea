using HubMi.Infrastructure.Imports.Adapters;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace HubMi.Infrastructure.Persistence;

/// <summary>Startup work with real effect: migrate the schema and seed the sample library into an empty database.</summary>
internal sealed class DatabaseInitializer(
    IServiceScopeFactory scopeFactory,
    IOptions<PersistenceOptions> options,
    TimeProvider clock,
    ILogger<DatabaseInitializer> logger) : IHostedService
{
    private static readonly string SampleLibraryPath =
        Path.Combine(AppContext.BaseDirectory, "Imports", "SampleData", "library.json");

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
}
