using HubMi.Domain;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace HubMi.Api.Middleware;

/// <summary>A refused business rule (e.g. publishing an unverified card, writing to a closed submission) is the client's 400, not a 500.</summary>
public sealed class DomainExceptionHandler(IProblemDetailsService problemDetails) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        if (exception is not DomainException rule)
            return false;

        httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        var details = new ProblemDetails { Status = StatusCodes.Status400BadRequest, Title = rule.Message, Type = "domain-rule" };
        if (rule.Field is not null)
            details.Extensions["field"] = rule.Field;

        return await problemDetails.TryWriteAsync(new ProblemDetailsContext { HttpContext = httpContext, Exception = exception, ProblemDetails = details });
    }
}
