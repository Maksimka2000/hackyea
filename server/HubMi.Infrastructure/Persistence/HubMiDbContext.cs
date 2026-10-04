using HubMi.Domain.Canvases;
using HubMi.Domain.Innovations;
using HubMi.Domain.Knowledge;
using HubMi.Domain.Matching;
using HubMi.Domain.Notifications;
using HubMi.Domain.Submissions;
using HubMi.Domain.Testing;
using HubMi.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HubMi.Infrastructure.Persistence;

/// <summary>One context for the app tables and the Identity account tables, so both share the database and its transactions.</summary>
public sealed class HubMiDbContext(DbContextOptions<HubMiDbContext> options)
    : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>(options)
{
    public DbSet<InnovationCategory> InnovationCategories => Set<InnovationCategory>();
    public DbSet<Innovation> Innovations => Set<Innovation>();
    public DbSet<InnovationEmbedding> InnovationEmbeddings => Set<InnovationEmbedding>();
    public DbSet<MatchRequest> MatchRequests => Set<MatchRequest>();
    public DbSet<MatchRequestResult> MatchRequestResults => Set<MatchRequestResult>();
    public DbSet<Submission> Submissions => Set<Submission>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<InnovationRating> InnovationRatings => Set<InnovationRating>();
    public DbSet<InnovationFeedback> InnovationFeedback => Set<InnovationFeedback>();
    public DbSet<InnovationCanvas> Canvases => Set<InnovationCanvas>();
    public DbSet<Challenge> Challenges => Set<Challenge>();
    public DbSet<Material> Materials => Set<Material>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.HasSequence<long>(Configurations.SubmissionConfiguration.NumberSequence);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(HubMiDbContext).Assembly);
    }
}
