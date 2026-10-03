namespace HubMi.Api.DependencyInjection;

public static class ApiServiceRegistration
{
    public static IServiceCollection AddApiServices(this IServiceCollection services)
    {
        services.AddProblemDetails();
        services.AddHealthChecks();

        return services;
    }
}
