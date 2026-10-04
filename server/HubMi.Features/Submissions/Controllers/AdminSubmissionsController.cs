using HubMi.Domain.Accounts;
using HubMi.Domain.Submissions;
using HubMi.Features.Accounts;
using HubMi.Features.Submissions.Contracts;
using HubMi.Features.Submissions.Ports;
using HubMi.Features.Submissions.Services;
using HubMi.Features.Submissions.Validators;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HubMi.Features.Submissions.Controllers;

/// <summary>ROPS staff: the submissions inbox, conversation, status, moderation and response time.</summary>
[ApiController]
[Authorize(Roles = AccountRoles.Admin)]
[Route("api/admin/submissions")]
public sealed class AdminSubmissionsController(SubmissionAdminService admin) : ControllerBase
{
    /// <summary>The inbox, newest first. Filters: status, type, categoryId, unseen (not opened by staff yet), q (number or text).</summary>
    [HttpGet]
    [ProducesResponseType<PagedResponse<AdminSubmissionRowResponse>>(StatusCodes.Status200OK)]
    public Task<PagedResponse<AdminSubmissionRowResponse>> Search(
        [FromQuery] SubmissionStatus? status,
        [FromQuery] SubmissionType? type,
        [FromQuery] string? categoryId,
        [FromQuery] bool unseen,
        [FromQuery] string? q,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default) =>
        admin.SearchAsync(
            new SubmissionFilter(
                status, type, categoryId, unseen, q?.Trim() is { Length: > 0 and <= 200 } query ? query : null,
                Math.Max(page, 1), Math.Clamp(pageSize, 1, SubmissionAdminService.MaxPageSize)),
            cancellationToken);

    /// <summary>Average and median time to the first staff reply, and how many submissions wait.</summary>
    [HttpGet("response-time")]
    [ProducesResponseType<ResponseTimeResponse>(StatusCodes.Status200OK)]
    public Task<ResponseTimeResponse> ResponseTime([FromQuery] DateTime? from, [FromQuery] DateTime? to, CancellationToken cancellationToken) =>
        admin.GetResponseTimeAsync(from, to, cancellationToken);

    /// <summary>Opens one submission; the first opening marks it seen and moves it to "in review".</summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType<SubmissionDetailsResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SubmissionDetailsResponse>> Open(Guid id, CancellationToken cancellationToken)
    {
        var submission = await admin.OpenAsync(User.GetCurrentUser(), id, cancellationToken);
        return submission is null ? NotFound() : submission;
    }

    [HttpPost("{id:guid}/messages")]
    [RequestSizeLimit(16_384)]
    [ProducesResponseType<SubmissionDetailsResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SubmissionDetailsResponse>> Reply(Guid id, [FromBody] AddMessageRequest? request, CancellationToken cancellationToken)
    {
        if (!SubmissionValidator.TryValidateMessage(request, out var body, out var errors))
            return ValidationProblem(new ValidationProblemDetails(errors));

        return ToResult(await admin.ReplyAsync(User.GetCurrentUser(), id, body, cancellationToken));
    }

    [HttpPut("{id:guid}/status")]
    [ProducesResponseType<SubmissionDetailsResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SubmissionDetailsResponse>> ChangeStatus(
        Guid id, [FromBody] ChangeStatusRequest? request, CancellationToken cancellationToken)
    {
        if (!SubmissionValidator.TryParse<SubmissionStatus>(request?.Status, out var status)
            || status is SubmissionStatus.Received or SubmissionStatus.Rejected)
            return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]>
            {
                ["status"] = ["Dozwolone: inReview, answered, closed. Odrzucenie wymaga podania powodu."]
            }));
        if (request?.Note?.Length > 1000)
            return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]> { ["note"] = ["Najwyżej 1000 znaków."] }));

        return ToResult(await admin.ChangeStatusAsync(User.GetCurrentUser(), id, status, request?.Note, cancellationToken));
    }

    /// <summary>Edit the submitter's text, or reject the submission when <c>rejectReason</c> is given.</summary>
    [HttpPut("{id:guid}/moderation")]
    [RequestSizeLimit(32_768)]
    [ProducesResponseType<SubmissionDetailsResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SubmissionDetailsResponse>> Moderate(
        Guid id, [FromBody] ModerateSubmissionRequest? request, CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(request?.RejectReason))
        {
            var reason = request.RejectReason.Trim();
            if (reason.Length > 1000)
                return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]> { ["rejectReason"] = ["Najwyżej 1000 znaków."] }));
            return ToResult(await admin.RejectAsync(User.GetCurrentUser(), id, reason, cancellationToken));
        }

        return ToResult(await admin.ModerateAsync(id, request ?? new ModerateSubmissionRequest(), cancellationToken));
    }

    /// <summary>Replace the innovations linked to the submission.</summary>
    [HttpPut("{id:guid}/links")]
    [ProducesResponseType<SubmissionDetailsResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SubmissionDetailsResponse>> ReplaceLinks(
        Guid id, [FromBody] ReplaceLinksRequest? request, CancellationToken cancellationToken)
    {
        var ids = request?.InnovationIds?.Where(i => i != Guid.Empty).Distinct().ToList() ?? [];
        if (ids.Count > 20)
            return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]> { ["innovationIds"] = ["Najwyżej 20 innowacji."] }));

        return ToResult(await admin.ReplaceLinksAsync(id, ids, cancellationToken));
    }

    /// <summary>Create a draft library card from an idea or good practice and link it to the submission.</summary>
    [HttpPost("{id:guid}/publish-as-innovation")]
    [ProducesResponseType<PublishedDraftResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PublishedDraftResponse>> PublishAsInnovation(Guid id, CancellationToken cancellationToken)
    {
        var (innovationId, result) = await admin.PublishAsInnovationAsync(id, cancellationToken);
        if (!result.Found)
            return NotFound();
        return innovationId is null ? ValidationProblem(new ValidationProblemDetails(result.Errors)) : new PublishedDraftResponse(innovationId.Value);
    }

    private ActionResult<SubmissionDetailsResponse> ToResult(AdminActionResult result) =>
        !result.Found ? NotFound()
        : result.Errors.Count > 0 ? ValidationProblem(new ValidationProblemDetails(result.Errors))
        : result.Details!;
}
