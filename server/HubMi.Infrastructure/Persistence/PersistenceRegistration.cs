using HubMi.Features.Admin.Ports;
using HubMi.Features.Canvases.Ports;
using HubMi.Features.Common.Ports;
using HubMi.Features.Innovations.Ports;
using HubMi.Features.Knowledge.Ports;
using HubMi.Features.Matching.Ports;
using HubMi.Features.Notifications.Ports;
using HubMi.Features.Submissions.Ports;
using HubMi.Features.Testing.Ports;
using HubMi.Infrastructure.Identity;
using HubMi.Infrastructure.Imports.Adapters;
using HubMi.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HubMi.Infrastructure.Persistence;

public static class PersistenceRegistration
{
    public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("HubMi")
                               ?? throw new InvalidOperationException(
                                   "Connection string 'HubMi' is not configured. Set ConnectionStrings__HubMi in the environment.");

        services.AddDbContext<HubMiDbContext>(options => options
            .UseNpgsql(connectionString)
            .UseSnakeCaseNamingConvention());

        services.AddMemoryCache();
        services.AddScoped<IInnovationSearch, PostgresInnovationSearch>();
        services.AddScoped<IDocumentFrequencyProvider, PostgresDocumentFrequencyProvider>();
        services.AddScoped<IInnovationCategoryReader, InnovationCategoryReader>();
        services.AddScoped<IMatchRequestLog, MatchRequestLog>();
        services.AddScoped<IInnovationDetailsReader, InnovationDetailsReader>();
        services.AddScoped<IInnovationListReader, InnovationListReader>();
        services.AddEngagementStores();
        services.AddAccountStorage();

        services.Configure<PersistenceOptions>(configuration.GetSection(PersistenceOptions.SectionName));
        services.AddHostedService<DatabaseInitializer>();

        return services;
    }

    /// <summary>Submissions, notifications, the knowledge store, the Innovation Tester, canvases and trends.</summary>
    private static IServiceCollection AddEngagementStores(this IServiceCollection services)
    {
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<ISubmissionStore, SubmissionStore>();
        services.AddScoped<ISubmissionQueries, SubmissionQueries>();
        services.AddScoped<INotificationStore, NotificationStore>();
        services.AddScoped<IInnovationEditor, InnovationEditor>();
        services.AddScoped<IChallengeStore, ChallengeStore>();
        services.AddScoped<IMaterialStore, MaterialStore>();
        services.AddScoped<IKnowledgeQueries, KnowledgeQueries>();
        services.AddScoped<IRatingStore, RatingStore>();
        services.AddScoped<IFeedbackStore, FeedbackStore>();
        services.AddScoped<TestingQueries>();
        services.AddScoped<ITestingQueries>(sp => sp.GetRequiredService<TestingQueries>());
        services.AddScoped<IInnovationRatingReader>(sp => sp.GetRequiredService<TestingQueries>());
        services.AddScoped<CanvasStore>();
        services.AddScoped<ICanvasStore>(sp => sp.GetRequiredService<CanvasStore>());
        services.AddScoped<ICanvasQueries>(sp => sp.GetRequiredService<CanvasStore>());
        services.AddSingleton<ICanvasTemplateSource, JsonCanvasTemplateSource>();
        services.AddScoped<ITrendQueries, TrendQueries>();

        return services;
    }
}
