namespace HubMi.Api.Extensions;

public static class PipelineExtensions
{
    public static WebApplication UseApiPipeline(this WebApplication app)
    {
        app.UseExceptionHandler();

        app.MapControllers();
        app.MapHealthChecks("/health");

        return app;
    }
}
