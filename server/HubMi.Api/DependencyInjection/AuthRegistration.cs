using System.Threading.RateLimiting;
using HubMi.Api.Authorization;
using HubMi.Features.Accounts;
using HubMi.Features.Accounts.Controllers;
using HubMi.Features.Accounts.Ports;
using HubMi.Features.Knowledge;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;

namespace HubMi.Api.DependencyInjection;

public static class AuthRegistration
{
    public const int MinimumKeyBytes = 32;

    /// <summary>Bearer-token sign-in for the public portal and the staff panel, plus a per-address limit on login attempts.</summary>
    public static IServiceCollection AddAuth(this IServiceCollection services, IConfiguration configuration)
    {
        var jwt = configuration.GetSection(JwtSettings.SectionName).Get<JwtSettings>() ?? new JwtSettings();
        if (System.Text.Encoding.UTF8.GetByteCount(jwt.SecretKey) < MinimumKeyBytes)
            throw new InvalidOperationException(
                $"Auth:Jwt:SecretKey must be at least {MinimumKeyBytes} bytes. Set Auth__Jwt__SecretKey in the environment.");

        services.Configure<JwtSettings>(configuration.GetSection(JwtSettings.SectionName));
        services.Configure<AccountsOptions>(configuration.GetSection(AccountsOptions.SectionName));
        services.Configure<KnowledgeOptions>(configuration.GetSection(KnowledgeOptions.SectionName));
        services.AddSingleton<IAccessTokenIssuer, JwtAccessTokenIssuer>();

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.MapInboundClaims = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = jwt.Issuer,
                    ValidateAudience = true,
                    ValidAudience = jwt.Audience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromSeconds(30),
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = JwtAccessTokenIssuer.SigningKey(jwt),
                    ValidAlgorithms = [SecurityAlgorithms.HmacSha256],
                    NameClaimType = CurrentUser.IdClaim,
                    RoleClaimType = CurrentUser.RoleClaim
                };
            });
        // Deny by default: an endpoint nobody annotated needs a signed-in user. Public endpoints say [AllowAnonymous].
        services.AddAuthorization(options =>
            options.FallbackPolicy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build());

        var permitLimit = configuration.GetValue("RateLimiting:Login:PermitLimit", 10);
        var window = TimeSpan.FromSeconds(configuration.GetValue("RateLimiting:Login:WindowSeconds", 60));
        services.Configure<RateLimiterOptions>(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            options.AddPolicy(AuthController.RateLimitPolicy, context =>
                RateLimitPartition.GetFixedWindowLimiter(
                    context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                    _ => new FixedWindowRateLimiterOptions { PermitLimit = permitLimit, Window = window, QueueLimit = 0 }));
        });

        return services;
    }
}
