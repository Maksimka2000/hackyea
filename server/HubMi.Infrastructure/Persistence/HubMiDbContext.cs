using HubMi.Domain.Innovations;
using Microsoft.EntityFrameworkCore;

namespace HubMi.Infrastructure.Persistence;

public sealed class HubMiDbContext(DbContextOptions<HubMiDbContext> options) : DbContext(options)
{
    public DbSet<InnovationCategory> InnovationCategories => Set<InnovationCategory>();
    public DbSet<Innovation> Innovations => Set<Innovation>();
    public DbSet<MatchRequest> MatchRequests => Set<MatchRequest>();
    public DbSet<MatchRequestResult> MatchRequestResults => Set<MatchRequestResult>();

    protected override void OnModelCreating(ModelBuilder modelBuilder) =>
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(HubMiDbContext).Assembly);
}
