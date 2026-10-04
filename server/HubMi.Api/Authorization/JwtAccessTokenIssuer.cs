using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HubMi.Features.Accounts;
using HubMi.Features.Accounts.Ports;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace HubMi.Api.Authorization;

/// <summary>
/// Issues the bearer token: who the caller is (sub, email, role) and nothing else. There is no refresh token;
/// when the token expires the user signs in again.
/// </summary>
public sealed class JwtAccessTokenIssuer(IOptions<JwtSettings> settings, TimeProvider clock) : IAccessTokenIssuer
{
    public IssuedToken Issue(Account account)
    {
        var jwt = settings.Value;
        var now = clock.GetUtcNow().UtcDateTime;
        var lifetime = TimeSpan.FromMinutes(jwt.AccessTokenMinutes);

        var claims = new List<Claim>
        {
            new(CurrentUser.IdClaim, account.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, account.Login),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(CurrentUser.RoleClaim, account.Role)
        };

        var token = new JwtSecurityToken(
            jwt.Issuer,
            jwt.Audience,
            claims,
            notBefore: now,
            expires: now + lifetime,
            signingCredentials: new SigningCredentials(SigningKey(jwt), SecurityAlgorithms.HmacSha256));

        return new IssuedToken(new JwtSecurityTokenHandler().WriteToken(token), (int)lifetime.TotalSeconds);
    }

    public static SymmetricSecurityKey SigningKey(JwtSettings settings) => new(Encoding.UTF8.GetBytes(settings.SecretKey));
}
