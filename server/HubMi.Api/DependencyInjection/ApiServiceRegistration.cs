using HubMi.Api.Middleware;

namespace HubMi.Api.DependencyInjection;

public static class ApiServiceRegistration
{
    public static IServiceCollection AddApiServices(this IServiceCollection services)
    {
        services.AddProblemDetails();
        services.AddExceptionHandler<BadHttpRequestExceptionHandler>();
        services.AddExceptionHandler<DomainExceptionHandler>();
        services.AddHealthChecks();

        return services;
    }
}
