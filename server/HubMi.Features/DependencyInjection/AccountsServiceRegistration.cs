using HubMi.Features.Accounts.Services;
using HubMi.Features.Notifications.Services;
using Microsoft.Extensions.DependencyInjection;

namespace HubMi.Features.DependencyInjection;

public static class AccountsServiceRegistration
{
    public static IServiceCollection AddAccountsFeature(this IServiceCollection services)
    {
        services.AddScoped<LoginService>();
        services.AddScoped<Notifier>();
        services.AddScoped<NotificationService>();

        return services;
    }
}
