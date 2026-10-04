using HubMi.Domain.Accounts;
using HubMi.Domain.Testing;
using HubMi.Features.Accounts;
using HubMi.Features.Testing.Contracts;
using HubMi.Features.Testing.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HubMi.Features.Testing.Controllers;

/// <summary>Innovation Tester: rate a solution, give feedback, propose improvements.</summary>
[ApiController]
[Route("api")]
public sealed class InnovationTesterController(InnovationTesterService tester) : ControllerBase
{
    /// <summary>Public: the card's star rating. Signed-in callers also get their own stars.</summary>
    [HttpGet("innovations/{id:guid}/rating-summary")]
    [AllowAnonymous]
    [ProducesResponseType<RatingSummaryResponse>(StatusCodes.Status200OK)]
    public Task<RatingSummaryResponse> GetSummary(Guid id, CancellationToken cancellationToken) =>
        tester.GetSummaryAsync(id, CurrentUser.From(User), cancellationToken);

    /// <summary>Rate 1–5 stars; rating again replaces the earlier stars.</summary>
    [HttpPut("innovations/{id:guid}/rating")]
    [Authorize(Roles = AccountRoles.Submitters)]
    [ProducesResponseType<RatingSummaryResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RatingSummaryResponse>> Rate(Guid id, [FromBody] RateRequest? request, CancellationToken cancellationToken)
    {
        var stars = request?.Stars ?? 0;
        if (stars is < InnovationRating.MinStars or > InnovationRating.MaxStars)
            return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]> { ["stars"] = ["Wybierz od 1 do 5 gwiazdek."] }));

        var summary = await tester.RateAsync(User.GetCurrentUser(), id, stars, cancellationToken);
        return summary is null ? NotFound() : summary;
    }

    [HttpPost("innovations/{id:guid}/feedback")]
    [Authorize(Roles = AccountRoles.Submitters)]
    [RequestSizeLimit(16_384)]
    [ProducesResponseType<FeedbackResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<FeedbackResponse>> AddFeedback(Guid id, [FromBody] FeedbackRequest? request, CancellationToken cancellationToken)
    {
        var errors = new Dictionary<string, string[]>();
        if (!Enum.TryParse<FeedbackKind>(request?.Kind?.Trim(), ignoreCase: true, out var kind) || !Enum.IsDefined(kind))
            errors["kind"] = ["Wybierz: opinia albo propozycja ulepszenia."];
        var body = request?.Body?.Trim() ?? string.Empty;
        if (body.Length < 5)
            errors["body"] = ["Napisz co najmniej 5 znaków."];
        else if (body.Length > InnovationFeedback.MaxBodyLength)
            errors["body"] = [$"Najwyżej {InnovationFeedback.MaxBodyLength} znaków."];
        if (errors.Count > 0)
            return ValidationProblem(new ValidationProblemDetails(errors));

        var created = await tester.AddFeedbackAsync(User.GetCurrentUser(), id, kind, body, cancellationToken);
        return created is null ? NotFound() : created;
    }

    /// <summary>The caller's own feedback and proposals, with the staff decision.</summary>
    [HttpGet("me/feedback")]
    [Authorize(Roles = AccountRoles.Submitters)]
    [ProducesResponseType<IReadOnlyList<FeedbackResponse>>(StatusCodes.Status200OK)]
    public Task<IReadOnlyList<FeedbackResponse>> GetMine(CancellationToken cancellationToken) =>
        tester.GetMineAsync(User.GetCurrentUser(), cancellationToken);

    /// <summary>Staff: all feedback, newest first.</summary>
    [HttpGet("admin/feedback")]
    [Authorize(Roles = AccountRoles.Admin)]
    [ProducesResponseType<IReadOnlyList<FeedbackResponse>>(StatusCodes.Status200OK)]
    public Task<IReadOnlyList<FeedbackResponse>> GetForStaff(
        [FromQuery] FeedbackKind? kind, [FromQuery] FeedbackStatus? status, CancellationToken cancellationToken) =>
        tester.GetForStaffAsync(kind, status, cancellationToken);

    /// <summary>Staff: the results of the tester – every rated card with its average, number of ratings and opinions still to review.</summary>
    [HttpGet("admin/feedback/ratings")]
    [Authorize(Roles = AccountRoles.Admin)]
    [ProducesResponseType<IReadOnlyList<RatedInnovationResponse>>(StatusCodes.Status200OK)]
    public Task<IReadOnlyList<RatedInnovationResponse>> GetRatingOverview(CancellationToken cancellationToken) =>
        tester.GetRatingOverviewAsync(cancellationToken);

    [HttpPut("admin/feedback/{id:guid}")]
    [Authorize(Roles = AccountRoles.Admin)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Review(Guid id, [FromBody] ReviewFeedbackRequest? request, CancellationToken cancellationToken)
    {
        if (!Enum.TryParse<FeedbackStatus>(request?.Status?.Trim(), ignoreCase: true, out var status)
            || status is not (FeedbackStatus.Accepted or FeedbackStatus.Rejected))
            return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]> { ["status"] = ["Dozwolone: accepted, rejected."] }));
        if (request?.StaffNote?.Length > 1000)
            return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]> { ["staffNote"] = ["Najwyżej 1000 znaków."] }));

        return await tester.ReviewAsync(id, status, request?.StaffNote, cancellationToken) ? NoContent() : NotFound();
    }
}
