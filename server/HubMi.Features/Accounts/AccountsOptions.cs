namespace HubMi.Features.Accounts;

public sealed class AccountsOptions
{
    public const string SectionName = "Auth";

    /// <summary>List the seeded demo accounts for the simulated Profil Zaufany screen. Turn off once real sign-in exists.</summary>
    public bool ExposeDemoAccounts { get; set; }
}
