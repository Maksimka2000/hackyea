using HubMi.Features.Accounts.Ports;
using HubMi.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace HubMi.Infrastructure.Identity;

public static class IdentityRegistration
{
    /// <summary>Identity storage in the HubMI database and password checks. Token issuing is the API host's job.</summary>
    public static IServiceCollection AddAccountStorage(this IServiceCollection services)
    {
        services.AddIdentityCore<ApplicationUser>(options =>
            {
                options.User.RequireUniqueEmail = false;
                options.Password.RequiredLength = 8;
                options.Password.RequireNonAlphanumeric = false;
                options.Lockout.AllowedForNewUsers = false;
            })
            .AddRoles<ApplicationRole>()
            .AddEntityFrameworkStores<HubMiDbContext>();

        services.AddScoped<IAccountDirectory, AccountDirectory>();
        services.AddScoped<DemoAccountSeeder>();

        return services;
    }
}
