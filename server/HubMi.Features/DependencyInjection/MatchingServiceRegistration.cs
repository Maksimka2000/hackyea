using HubMi.Features.Matching.Services;
using HubMi.Features.Matching.Validators;
using Microsoft.Extensions.DependencyInjection;

namespace HubMi.Features.DependencyInjection;

public static class MatchingServiceRegistration
{
    public static IServiceCollection AddMatchingFeature(this IServiceCollection services)
    {
        services.AddSingleton(TimeProvider.System);
        services.AddSingleton<MatchAnswerCache>();
        services.AddSingleton<QueryAnalyzer>();
        services.AddSingleton<RelevanceScorer>();
        services.AddSingleton<MatchRequestValidator>();
        services.AddScoped<MatchingService>();

        return services;
    }
}
