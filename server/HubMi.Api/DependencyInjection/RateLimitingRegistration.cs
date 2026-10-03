using System.Globalization;
using System.Threading.RateLimiting;
using HubMi.Features.Matching.Controllers;
using Microsoft.AspNetCore.RateLimiting;

namespace HubMi.Api.DependencyInjection;

public static class RateLimitingRegistration
{
    /// <summary>The public matching endpoint is anonymous, so it is bounded per client address.</summary>
    public static IServiceCollection AddMatchRateLimiting(this IServiceCollection services, IConfiguration configuration)
    {
        var permitLimit = configuration.GetValue("RateLimiting:Match:PermitLimit", 20);
        var window = TimeSpan.FromSeconds(configuration.GetValue("RateLimiting:Match:WindowSeconds", 60));

        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            options.AddPolicy(MatchController.RateLimitPolicy, context =>
                RateLimitPartition.GetFixedWindowLimiter(
                    context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = permitLimit,
                        Window = window,
                        QueueLimit = 0
                    }));

            options.OnRejected = (context, _) =>
            {
                if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
                    context.HttpContext.Response.Headers.RetryAfter =
                        ((int)retryAfter.TotalSeconds).ToString(CultureInfo.InvariantCulture);

                return ValueTask.CompletedTask;
            };
        });

        return services;
    }
}
