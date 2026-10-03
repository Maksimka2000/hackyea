using Microsoft.Extensions.DependencyInjection;

namespace HubMi.Features.DependencyInjection;

public static class FeatureServiceRegistration
{
    public static IServiceCollection AddFeatureServices(this IServiceCollection services)
    {
        services.AddControllers()
            .AddApplicationPart(typeof(FeatureServiceRegistration).Assembly);

        services.AddMatchingFeature();
        services.AddInnovationsFeature();

        return services;
    }
}
