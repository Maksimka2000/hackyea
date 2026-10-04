using HubMi.Features.Accounts.Contracts;
using HubMi.Features.Accounts.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Options;

namespace HubMi.Features.Accounts.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(LoginService logins, IOptions<AccountsOptions> options) : ControllerBase
{
    public const string RateLimitPolicy = "login";

    /// <summary>Public-site sign-in (residents, NGOs, local governments) behind the simulated Profil Zaufany screen. Staff accounts get 403.</summary>
    [HttpPost("login")]
    [AllowAnonymous]
    [EnableRateLimiting(RateLimitPolicy)]
    [ProducesResponseType<LoginResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status403Forbidden)]
    public Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest? request, CancellationToken cancellationToken) =>
        LoginAsync(LoginPortal.Public, request, cancellationToken);

    /// <summary>ROPS staff panel sign-in. Public accounts get 403.</summary>
    [HttpPost("admin/login")]
    [AllowAnonymous]
    [EnableRateLimiting(RateLimitPolicy)]
    [ProducesResponseType<LoginResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status403Forbidden)]
    public Task<ActionResult<LoginResponse>> AdminLogin([FromBody] LoginRequest? request, CancellationToken cancellationToken) =>
        LoginAsync(LoginPortal.Admin, request, cancellationToken);

    /// <summary>The signed-in account.</summary>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType<AccountResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AccountResponse>> Me(CancellationToken cancellationToken)
    {
        var account = await logins.GetAsync(User.GetCurrentUser().Id, cancellationToken);
        return account is null ? Unauthorized() : account;
    }

    /// <summary>Seeded demo accounts for the simulated Profil Zaufany picker; 404 when disabled.</summary>
    [HttpGet("demo-accounts")]
    [AllowAnonymous]
    [ProducesResponseType<IReadOnlyList<DemoAccountResponse>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IReadOnlyList<DemoAccountResponse>>> DemoAccounts(CancellationToken cancellationToken) =>
        options.Value.ExposeDemoAccounts ? Ok(await logins.GetDemoAccountsAsync(cancellationToken)) : NotFound();

    private async Task<ActionResult<LoginResponse>> LoginAsync(LoginPortal portal, LoginRequest? request, CancellationToken cancellationToken)
    {
        var login = request?.Login?.Trim() ?? string.Empty;
        var password = request?.Password ?? string.Empty;
        if (login.Length is 0 or > LoginService.MaxLoginLength || password.Length is 0 or > LoginService.MaxPasswordLength)
            return Problem(statusCode: StatusCodes.Status401Unauthorized, title: "Nieprawidłowy login lub hasło.");

        var result = await logins.LoginAsync(portal, login, password, cancellationToken);
        return result.Outcome switch
        {
            LoginOutcome.Success => result.Response!,
            LoginOutcome.WrongPortal => Problem(
                statusCode: StatusCodes.Status403Forbidden,
                title: portal == LoginPortal.Admin
                    ? "To konto nie ma dostępu do panelu ROPS."
                    : "Konto pracownika ROPS loguje się w panelu administracyjnym.",
                type: "auth/wrong-portal"),
            _ => Problem(statusCode: StatusCodes.Status401Unauthorized, title: "Nieprawidłowy login lub hasło.")
        };
    }
}
