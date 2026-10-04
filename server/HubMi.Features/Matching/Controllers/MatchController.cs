using HubMi.Features.Matching.Contracts;
using HubMi.Features.Matching.Services;
using HubMi.Features.Matching.Validators;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Options;

namespace HubMi.Features.Matching.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/match")]
public sealed class MatchController(
    MatchRequestValidator validator,
    MatchingService matching,
    IOptions<MatchingOptions> options) : ControllerBase
{
    public const string RateLimitPolicy = "match";

    /// <summary>Public and anonymous: describe a problem, get the best matching innovations.</summary>
    [HttpPost]
    [EnableRateLimiting(RateLimitPolicy)]
    [RequestSizeLimit(16_384)]
    [ProducesResponseType<MatchResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<MatchResponse>> Match([FromBody] MatchRequestDto? request, CancellationToken cancellationToken)
    {
        if (!validator.TryValidate(request, options.Value, out var validated, out var errors))
            return ValidationProblem(new ValidationProblemDetails(errors));

        var clientKey = ClientKey.From(HttpContext.Connection.RemoteIpAddress?.ToString(), options.Value.ClientKeySalt);
        return await matching.MatchAsync(validated!, clientKey, cancellationToken);
    }
}
