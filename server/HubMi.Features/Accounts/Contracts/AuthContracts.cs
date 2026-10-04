namespace HubMi.Features.Accounts.Contracts;

public sealed class LoginRequest
{
    public string? Login { get; init; }
    public string? Password { get; init; }
}

public sealed record LoginResponse(string AccessToken, int ExpiresInSeconds, AccountResponse User);

public sealed record AccountResponse(Guid Id, string Login, string DisplayName, string Role, string? OrganizationName, string? Municipality);

/// <summary>A seeded demo account offered by the simulated Profil Zaufany screen. No password: it is shared and documented.</summary>
public sealed record DemoAccountResponse(string Login, string DisplayName, string Role, string? OrganizationName);
