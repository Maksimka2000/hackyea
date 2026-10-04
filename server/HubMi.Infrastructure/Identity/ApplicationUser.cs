using Microsoft.AspNetCore.Identity;

namespace HubMi.Infrastructure.Identity;

/// <summary>
/// An account in ASP.NET Core Identity storage. Persistence detail, not a domain type: the features see <c>Account</c>.
/// The login is the user name (an e-mail-like identifier); accounts are seeded, there is no registration.
/// </summary>
public sealed class ApplicationUser : IdentityUser<Guid>
{
    public string DisplayName { get; set; } = null!;

    /// <summary>The NGO or local government the account acts for; null for a resident or staff member.</summary>
    public string? OrganizationName { get; set; }

    /// <summary>For a local government (JST): its municipality.</summary>
    public string? Municipality { get; set; }
}

public sealed class ApplicationRole : IdentityRole<Guid>
{
    public ApplicationRole()
    {
    }

    public ApplicationRole(string name) : base(name)
    {
    }
}
