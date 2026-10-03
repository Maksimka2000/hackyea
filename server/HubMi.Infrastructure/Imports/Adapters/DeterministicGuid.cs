using System.Security.Cryptography;
using System.Text;

namespace HubMi.Infrastructure.Imports.Adapters;

/// <summary>
/// Name-based (RFC 4122 version 5) GUIDs for imported cards. The same ROPS slug always yields the same id,
/// so re-seeding a fresh database keeps ids stable across environments, links and logs.
/// </summary>
internal static class DeterministicGuid
{
    private static readonly Guid Namespace = new("6f1d1a52-3f0e-4b8e-9a4c-5d2b8c7e1f30");

    public static Guid FromSlug(string slug)
    {
        var namespaceBytes = Namespace.ToByteArray();
        SwapByteOrder(namespaceBytes);

        var hash = SHA1.HashData([.. namespaceBytes, .. Encoding.UTF8.GetBytes(slug)]);
        var bytes = hash[..16];
        bytes[6] = (byte)((bytes[6] & 0x0F) | 0x50);
        bytes[8] = (byte)((bytes[8] & 0x3F) | 0x80);
        SwapByteOrder(bytes);

        return new Guid(bytes);
    }

    // .NET stores the first three GUID fields little-endian; RFC 4122 hashing uses network order.
    private static void SwapByteOrder(byte[] guid)
    {
        (guid[0], guid[3]) = (guid[3], guid[0]);
        (guid[1], guid[2]) = (guid[2], guid[1]);
        (guid[4], guid[5]) = (guid[5], guid[4]);
        (guid[6], guid[7]) = (guid[7], guid[6]);
    }
}
