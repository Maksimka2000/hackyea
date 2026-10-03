using Microsoft.OpenApi.Models;

namespace HubMi.Api.DependencyInjection;

public static class SwaggerRegistration
{
    public const string EnabledSetting = "Swagger:Enabled";

    public static IServiceCollection AddSwaggerDocs(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
            options.SwaggerDoc("v1", new OpenApiInfo { Title = "HubMI.pl API", Version = "v1" }));

        return services;
    }
}
