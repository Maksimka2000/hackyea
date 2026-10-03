using HubMi.Features.Innovations.Ports;
using HubMi.Features.Matching.Ports;
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

        services.Configure<PersistenceOptions>(configuration.GetSection(PersistenceOptions.SectionName));
        services.AddHostedService<DatabaseInitializer>();

        return services;
    }
}
