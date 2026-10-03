using System.Net;
using Microsoft.AspNetCore.HttpOverrides;
using TrustedNetwork = Microsoft.AspNetCore.HttpOverrides.IPNetwork;

namespace HubMi.Api.DependencyInjection;

public sealed class ForwardedHeadersSettings
{
    public const string SectionName = "ForwardedHeaders";

    /// <summary>Addresses of proxies whose X-Forwarded-* headers are trusted, e.g. "10.0.0.5".</summary>
    public string[] KnownProxies { get; set; } = [];

    /// <summary>CIDR ranges of trusted proxies, e.g. "172.16.0.0/12". Use the network the Next.js proxy or Azure ingress sits in.</summary>
    public string[] KnownNetworks { get; set; } = [];

    /// <summary>How many proxy hops to unwind. Each hop must itself be a trusted proxy or network.</summary>
    public int ForwardLimit { get; set; } = 1;
}

public static class ForwardedHeadersRegistration
{
    /// <summary>
    /// Makes the real client address (not the proxy's) visible to rate limiting and the request log.
    /// Headers are honoured only when the immediate caller is a configured proxy; otherwise anyone could spoof X-Forwarded-For
    /// and bypass the limit. With nothing configured the framework default applies (loopback only).
    /// </summary>
    public static IServiceCollection AddForwardedHeadersSupport(this IServiceCollection services, IConfiguration configuration)
    {
        var settings = configuration.GetSection(ForwardedHeadersSettings.SectionName).Get<ForwardedHeadersSettings>()
                       ?? new ForwardedHeadersSettings();

        services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            options.ForwardLimit = settings.ForwardLimit;

            if (settings.KnownProxies.Length == 0 && settings.KnownNetworks.Length == 0)
                return;

            options.KnownProxies.Clear();
            options.KnownNetworks.Clear();

            foreach (var proxy in settings.KnownProxies)
                options.KnownProxies.Add(IPAddress.Parse(proxy.Trim()));

            foreach (var network in settings.KnownNetworks)
                options.KnownNetworks.Add(ParseNetwork(network));
        });

        return services;
    }

    private static TrustedNetwork ParseNetwork(string cidr)
    {
        var parts = cidr.Trim().Split('/');
        if (parts.Length != 2 || !IPAddress.TryParse(parts[0], out var prefix) || !int.TryParse(parts[1], out var length))
            throw new InvalidOperationException($"ForwardedHeaders:KnownNetworks entry '{cidr}' is not a CIDR range such as 10.0.0.0/8.");

        return new TrustedNetwork(prefix, length);
    }
}
