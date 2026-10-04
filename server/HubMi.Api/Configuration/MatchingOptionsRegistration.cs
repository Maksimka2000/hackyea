using HubMi.Features.Matching;
using Microsoft.Extensions.Options;

namespace HubMi.Api.Configuration;

public static class MatchingOptionsRegistration
{
    /// <summary>Word lists and thresholds live in search-config.json so they can be tuned without touching code.</summary>
    public static ConfigurationManager AddSearchConfiguration(this ConfigurationManager configuration)
    {
        configuration.AddJsonFile("search-config.json", optional: false, reloadOnChange: false);
        return configuration;
    }

    public static IServiceCollection AddMatchingOptions(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<MatchingOptions>()
            .Bind(configuration.GetSection(MatchingOptions.SectionName))
            .ValidateDataAnnotations()
            .Validate(o => o.GoodThreshold > o.PartialThreshold, "GoodThreshold must be greater than PartialThreshold.")
            .Validate(o => o.RerankCandidates <= o.RetrievalLimit, "RerankCandidates must not exceed RetrievalLimit.")
            .Validate(o => o.RerankCeiling > o.RerankThreshold, "RerankCeiling must be greater than RerankThreshold.")
            .Validate(o => o.RetrievalOnlyCeiling > o.RetrievalOnlyFloor, "RetrievalOnlyCeiling must be greater than RetrievalOnlyFloor.")
            .Validate(o => o.RetrievalOnlyFloor >= o.RetrievalFloor, "RetrievalOnlyFloor must not be lower than RetrievalFloor.")
            .ValidateOnStart();

        return services;
    }
}
