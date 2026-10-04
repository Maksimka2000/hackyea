using HubMi.Domain.Accounts;
using HubMi.Domain.Submissions;
using HubMi.Features.Admin.Contracts;
using HubMi.Features.Admin.Ports;
using HubMi.Features.Admin.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HubMi.Features.Admin.Controllers;

/// <summary>Staff only: the start-page figures and the trend dashboard of aggregated needs.</summary>
[ApiController]
[Authorize(Roles = AccountRoles.Admin)]
[Route("api/admin")]
public sealed class AdminDashboardController(TrendService trends) : ControllerBase
{
    [HttpGet("overview")]
    [ProducesResponseType<AdminOverviewResponse>(StatusCodes.Status200OK)]
    public Task<AdminOverviewResponse> Overview(CancellationToken cancellationToken) =>
        trends.GetOverviewAsync(cancellationToken);

    /// <summary>Submissions by category, week and submitter role, plus unmatched searches. Window bounds are UTC; type narrows to one kind.</summary>
    [HttpGet("trends")]
    [ProducesResponseType<TrendsResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TrendsResponse>> Trends(
        [FromQuery] DateTime? from, [FromQuery] DateTime? to, [FromQuery] SubmissionType? type, CancellationToken cancellationToken)
    {
        if (from > to)
            return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]> { ["from"] = ["Początek okresu jest po jego końcu."] }));

        return await trends.GetAsync(new TrendWindow(ToUtc(from), ToUtc(to), type), cancellationToken);
    }

    private static DateTime? ToUtc(DateTime? value) =>
        value is null ? null : DateTime.SpecifyKind(value.Value, value.Value.Kind == DateTimeKind.Unspecified ? DateTimeKind.Utc : value.Value.Kind).ToUniversalTime();
}
