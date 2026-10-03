using HubMi.Features.Innovations.Services;
using Microsoft.Extensions.DependencyInjection;

namespace HubMi.Features.DependencyInjection;

public static class InnovationsServiceRegistration
{
    public static IServiceCollection AddInnovationsFeature(this IServiceCollection services)
    {
        services.AddScoped<InnovationDetailsService>();

        return services;
    }
}
