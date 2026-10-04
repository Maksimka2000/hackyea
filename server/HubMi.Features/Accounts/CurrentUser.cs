using System.Security.Claims;

namespace HubMi.Features.Accounts;

/// <summary>The signed-in caller, read from the access token. Claim names are kept as issued (sub, role); no inbound mapping.</summary>
public sealed record CurrentUser(Guid Id, string Role)
{
    public const string IdClaim = "sub";
    public const string RoleClaim = "role";

    public static CurrentUser? From(ClaimsPrincipal principal)
    {
        var id = principal.FindFirstValue(IdClaim);
        var role = principal.FindFirstValue(RoleClaim);
        return Guid.TryParse(id, out var userId) && !string.IsNullOrEmpty(role) ? new CurrentUser(userId, role) : null;
    }
}

public static class ClaimsPrincipalExtensions
{
    /// <summary>Only for endpoints behind <c>[Authorize]</c>: a missing or malformed token never reaches them.</summary>
    public static CurrentUser GetCurrentUser(this ClaimsPrincipal principal) =>
        CurrentUser.From(principal) ?? throw new InvalidOperationException("The access token has no user id or role.");
}
