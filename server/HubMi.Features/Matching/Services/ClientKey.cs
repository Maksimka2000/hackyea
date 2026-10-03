using System.Security.Cryptography;
using System.Text;

namespace HubMi.Features.Matching.Services;

public static class ClientKey
{
    /// <summary>One-way hash of the client address; no address is ever stored.</summary>
    public static string? From(string? address, string salt)
    {
        if (string.IsNullOrEmpty(address))
            return null;

        var hash = SHA256.HashData(Encoding.UTF8.GetBytes($"{salt}:{address}"));
        return Convert.ToHexString(hash)[..32].ToLowerInvariant();
    }
}
