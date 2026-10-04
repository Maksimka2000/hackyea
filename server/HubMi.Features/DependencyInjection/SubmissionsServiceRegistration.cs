using HubMi.Features.Admin.Services;
using HubMi.Features.Submissions.Services;
using HubMi.Features.Submissions.Validators;
using Microsoft.Extensions.DependencyInjection;

namespace HubMi.Features.DependencyInjection;

public static class SubmissionsServiceRegistration
{
    public static IServiceCollection AddSubmissionsFeature(this IServiceCollection services)
    {
        services.AddSingleton<SubmissionValidator>();
        services.AddScoped<SubmissionViewBuilder>();
        services.AddScoped<SubmissionService>();
        services.AddScoped<SubmissionAdminService>();
        services.AddScoped<TrendService>();

        return services;
    }
}
