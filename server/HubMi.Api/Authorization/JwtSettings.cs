namespace HubMi.Api.Authorization;

public sealed class JwtSettings
{
    public const string SectionName = "Auth:Jwt";

    public string Issuer { get; set; } = "hubmi-api";
    public string Audience { get; set; } = "hubmi-web";
    public int AccessTokenMinutes { get; set; } = 480;

    /// <summary>HMAC-SHA256 signing key, at least 32 bytes. Supplied by environment or user secrets; never committed for production.</summary>
    public string SecretKey { get; set; } = string.Empty;
}
