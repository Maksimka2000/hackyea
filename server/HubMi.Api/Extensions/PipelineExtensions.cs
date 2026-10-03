using HubMi.Api.DependencyInjection;

namespace HubMi.Api.Extensions;

public static class PipelineExtensions
{
    public static WebApplication UseApiPipeline(this WebApplication app)
    {
        // First: everything below (rate limiting, logging) must see the real client address.
        app.UseForwardedHeaders();
        app.UseExceptionHandler();

        if (app.Configuration.GetValue<bool>(SwaggerRegistration.EnabledSetting))
        {
            app.UseSwagger();
            app.UseSwaggerUI(options => options.RoutePrefix = "swagger");
        }

        app.UseRateLimiter();

        app.MapControllers();
        app.MapHealthChecks("/health");

        return app;
    }
}
