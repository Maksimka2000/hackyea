using Microsoft.OpenApi.Models;

namespace HubMi.Api.DependencyInjection;

public static class SwaggerRegistration
{
    public const string EnabledSetting = "Swagger:Enabled";

    public static IServiceCollection AddSwaggerDocs(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo { Title = "HubMI.pl API", Version = "v1" });

            // "Authorize" in the UI: paste the accessToken from POST /api/auth/login or /api/auth/admin/login.
            var bearer = new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            };
            options.AddSecurityDefinition("Bearer", bearer);
            options.AddSecurityRequirement(new OpenApiSecurityRequirement { [bearer] = [] });
        });

        return services;
    }
}
