using HubMi.Domain.Accounts;
using HubMi.Features.Accounts.Contracts;
using HubMi.Features.Accounts.Ports;

namespace HubMi.Features.Accounts.Services;

public enum LoginPortal
{
    /// <summary>The public site: residents, NGOs and local governments.</summary>
    Public,

    /// <summary>The ROPS staff panel.</summary>
    Admin
}

public enum LoginOutcome
{
    Success,
    InvalidCredentials,
    WrongPortal
}

public sealed record LoginResult(LoginOutcome Outcome, LoginResponse? Response);

/// <summary>Checks the password and the portal, then issues the access token. Staff cannot sign in on the public site and vice versa.</summary>
public sealed class LoginService(IAccountDirectory accounts, IAccessTokenIssuer tokens)
{
    public const int MaxLoginLength = 256;
    public const int MaxPasswordLength = 128;

    public async Task<LoginResult> LoginAsync(LoginPortal portal, string login, string password, CancellationToken cancellationToken)
    {
        var account = await accounts.VerifyPasswordAsync(login.Trim(), password, cancellationToken);
        if (account is null)
            return new LoginResult(LoginOutcome.InvalidCredentials, null);

        var allowed = portal == LoginPortal.Admin ? account.Role == AccountRoles.Admin : AccountRoles.IsSubmitter(account.Role);
        if (!allowed)
            return new LoginResult(LoginOutcome.WrongPortal, null);

        var token = tokens.Issue(account);
        return new LoginResult(LoginOutcome.Success, new LoginResponse(token.AccessToken, token.ExpiresInSeconds, ToResponse(account)));
    }

    public async Task<AccountResponse?> GetAsync(Guid id, CancellationToken cancellationToken)
    {
        var account = await accounts.FindAsync(id, cancellationToken);
        return account is null ? null : ToResponse(account);
    }

    public async Task<IReadOnlyList<DemoAccountResponse>> GetDemoAccountsAsync(CancellationToken cancellationToken) =>
        (await accounts.GetSubmitterAccountsAsync(cancellationToken))
        .Select(a => new DemoAccountResponse(a.Login, a.DisplayName, a.Role, a.OrganizationName))
        .ToList();

    private static AccountResponse ToResponse(Account a) =>
        new(a.Id, a.Login, a.DisplayName, a.Role, a.OrganizationName, a.Municipality);
}
