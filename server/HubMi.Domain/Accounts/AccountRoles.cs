namespace HubMi.Domain.Accounts;

/// <summary>
/// The four kinds of account. Residents, NGOs and local governments (JST) sign in on the public portal and submit;
/// ROPS staff sign in on the admin panel. An account holds exactly one role.
/// </summary>
public static class AccountRoles
{
    public const string Resident = "Resident";
    public const string Ngo = "Ngo";
    public const string Jst = "Jst";
    public const string Admin = "Admin";

    /// <summary>Comma-separated, for <c>[Authorize(Roles = ...)]</c>.</summary>
    public const string Submitters = Resident + "," + Ngo + "," + Jst;

    public static readonly IReadOnlyList<string> All = [Resident, Ngo, Jst, Admin];

    public static bool IsSubmitter(string? role) => role is Resident or Ngo or Jst;
}
