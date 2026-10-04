using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.DependencyInjection;

namespace HubMi.Features.DependencyInjection;

public static class FeatureServiceRegistration
{
    public static IServiceCollection AddFeatureServices(this IServiceCollection services)
    {
        services.AddControllers()
            .AddApplicationPart(typeof(FeatureServiceRegistration).Assembly)
            .AddJsonOptions(options =>
            {
                // Enums travel as camelCase names ("inReview"), in values and in dictionary keys alike.
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
                options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
            });

        services.AddMatchingFeature();
        services.AddInnovationsFeature();
        services.AddAccountsFeature();
        services.AddSubmissionsFeature();
        services.AddKnowledgeFeature();

        return services;
    }
}
