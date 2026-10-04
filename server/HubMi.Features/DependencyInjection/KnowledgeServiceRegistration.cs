using HubMi.Features.Canvases.Services;
using HubMi.Features.Knowledge.Services;
using HubMi.Features.Testing.Services;
using Microsoft.Extensions.DependencyInjection;

namespace HubMi.Features.DependencyInjection;

public static class KnowledgeServiceRegistration
{
    /// <summary>Knowledge store editing, the Innovation Tester and the Social Innovation Canvases.</summary>
    public static IServiceCollection AddKnowledgeFeature(this IServiceCollection services)
    {
        services.AddScoped<InnovationEditingService>();
        services.AddScoped<KnowledgeContentService>();
        services.AddScoped<InnovationTesterService>();
        services.AddSingleton<CanvasContentChecker>();
        services.AddScoped<CanvasService>();

        return services;
    }
}
