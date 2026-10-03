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
            .ValidateOnStart();

        return services;
    }
}
