using System.Text.Json;
using HubMi.Domain.Accounts;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace HubMi.Infrastructure.Identity;

/// <summary>
/// Creates the roles and the demo accounts from <c>Imports/SampleData/demo-accounts.json</c>. Existing accounts are left as they
/// are, so a changed password survives restarts. Demo data only: no real person is behind these accounts.
/// </summary>
internal sealed class DemoAccountSeeder(
    UserManager<ApplicationUser> users,
    RoleManager<ApplicationRole> roles,
    ILogger<DemoAccountSeeder> logger)
{
    private static readonly string DemoAccountsPath =
        Path.Combine(AppContext.BaseDirectory, "Imports", "SampleData", "demo-accounts.json");

    private static readonly JsonSerializerOptions Json = new() { PropertyNameCaseInsensitive = true };

    public async Task SeedAsync(CancellationToken cancellationToken)
    {
        foreach (var name in AccountRoles.All)
        {
            if (!await roles.RoleExistsAsync(name))
                Check(await roles.CreateAsync(new ApplicationRole(name)), $"role {name}");
        }

        await using var file = File.OpenRead(DemoAccountsPath);
        var seed = await JsonSerializer.DeserializeAsync<DemoAccountFile>(file, Json, cancellationToken)
                   ?? throw new InvalidOperationException("demo-accounts.json is empty.");

        var created = 0;
        foreach (var account in seed.Accounts)
        {
            if (!AccountRoles.All.Contains(account.Role))
                throw new InvalidOperationException($"Demo account {account.Login} has unknown role {account.Role}.");
            if (await users.FindByNameAsync(account.Login) is not null)
                continue;

            var user = new ApplicationUser
            {
                Id = account.Id ?? Guid.NewGuid(),
                UserName = account.Login,
                Email = account.Login,
                EmailConfirmed = true,
                DisplayName = account.DisplayName,
                OrganizationName = account.OrganizationName,
                Municipality = account.Municipality
            };

            Check(await users.CreateAsync(user, account.Password ?? seed.Password), $"account {account.Login}");
            Check(await users.AddToRoleAsync(user, account.Role), $"role of {account.Login}");
            created++;
        }

        if (created > 0)
            logger.LogInformation("Seeded {Count} demo accounts.", created);
    }

    private static void Check(IdentityResult result, string what)
    {
        if (!result.Succeeded)
            throw new InvalidOperationException($"Seeding {what} failed: {string.Join("; ", result.Errors.Select(e => e.Description))}");
    }

    private sealed record DemoAccountFile(string Password, IReadOnlyList<DemoAccount> Accounts);

    private sealed record DemoAccount(
        Guid? Id, string Login, string? Password, string Role, string DisplayName, string? OrganizationName, string? Municipality);
}
