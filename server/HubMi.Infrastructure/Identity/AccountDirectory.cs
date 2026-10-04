using HubMi.Domain.Accounts;
using HubMi.Features.Accounts.Ports;
using HubMi.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HubMi.Infrastructure.Identity;

/// <summary>Accounts and password checks on top of Identity. An account has exactly one role.</summary>
internal sealed class AccountDirectory(UserManager<ApplicationUser> users, HubMiDbContext db) : IAccountDirectory
{
    public async Task<Account?> VerifyPasswordAsync(string login, string password, CancellationToken cancellationToken)
    {
        var user = await users.FindByNameAsync(login);
        if (user is null)
        {
            // Spend about the same time as a real check, so response time does not reveal which logins exist.
            users.PasswordHasher.HashPassword(new ApplicationUser(), password);
            return null;
        }

        if (!await users.CheckPasswordAsync(user, password))
            return null;

        var role = (await users.GetRolesAsync(user)).FirstOrDefault();
        return role is null ? null : ToAccount(user, role);
    }

    public async Task<Account?> FindAsync(Guid id, CancellationToken cancellationToken) =>
        (await FindManyAsync([id], cancellationToken)).GetValueOrDefault(id);

    public async Task<IReadOnlyDictionary<Guid, Account>> FindManyAsync(IReadOnlyCollection<Guid> ids, CancellationToken cancellationToken)
    {
        if (ids.Count == 0)
            return new Dictionary<Guid, Account>();

        var rows = await (
                from user in db.Users.AsNoTracking()
                join link in db.UserRoles on user.Id equals link.UserId
                join role in db.Roles on link.RoleId equals role.Id
                where ids.Contains(user.Id)
                select new { user, role = role.Name! })
            .ToListAsync(cancellationToken);

        return rows.GroupBy(r => r.user.Id).ToDictionary(g => g.Key, g => ToAccount(g.First().user, g.First().role));
    }

    public async Task<IReadOnlyList<Account>> GetSubmitterAccountsAsync(CancellationToken cancellationToken)
    {
        var rows = await (
                from user in db.Users.AsNoTracking()
                join link in db.UserRoles on user.Id equals link.UserId
                join role in db.Roles on link.RoleId equals role.Id
                where role.Name == AccountRoles.Resident || role.Name == AccountRoles.Ngo || role.Name == AccountRoles.Jst
                orderby role.Name, user.DisplayName
                select new { user, role = role.Name! })
            .ToListAsync(cancellationToken);

        return rows.Select(r => ToAccount(r.user, r.role)).ToList();
    }

    private static Account ToAccount(ApplicationUser user, string role) =>
        new(user.Id, user.UserName!, user.DisplayName, role, user.OrganizationName, user.Municipality);
}
