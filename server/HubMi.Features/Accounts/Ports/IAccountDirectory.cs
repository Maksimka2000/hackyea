namespace HubMi.Features.Accounts.Ports;

public sealed record Account(Guid Id, string Login, string DisplayName, string Role, string? OrganizationName, string? Municipality);

/// <summary>Account storage and password checks. Accounts are seeded; there is no registration.</summary>
public interface IAccountDirectory
{
    /// <summary>The account when the login exists and the password matches; otherwise null (never says which part was wrong).</summary>
    Task<Account?> VerifyPasswordAsync(string login, string password, CancellationToken cancellationToken);

    Task<Account?> FindAsync(Guid id, CancellationToken cancellationToken);

    /// <summary>Display names for showing who wrote a message or a submission; unknown ids are left out.</summary>
    Task<IReadOnlyDictionary<Guid, Account>> FindManyAsync(IReadOnlyCollection<Guid> ids, CancellationToken cancellationToken);

    /// <summary>Seeded resident, NGO and JST accounts, for the simulated Profil Zaufany picker.</summary>
    Task<IReadOnlyList<Account>> GetSubmitterAccountsAsync(CancellationToken cancellationToken);
}

public sealed record IssuedToken(string AccessToken, int ExpiresInSeconds);

/// <summary>Signs the access token. Implemented in the API host, which owns the signing key.</summary>
public interface IAccessTokenIssuer
{
    IssuedToken Issue(Account account);
}
