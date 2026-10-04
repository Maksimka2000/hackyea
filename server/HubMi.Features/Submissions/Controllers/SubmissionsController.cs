using HubMi.Domain.Accounts;
using HubMi.Features.Accounts;
using HubMi.Features.Submissions.Contracts;
using HubMi.Features.Submissions.Services;
using HubMi.Features.Submissions.Validators;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HubMi.Features.Submissions.Controllers;

/// <summary>Signed-in residents, NGOs and local governments: send to ROPS, follow the status, talk to staff.</summary>
[ApiController]
[Authorize(Roles = AccountRoles.Submitters)]
[Route("api/submissions")]
public sealed class SubmissionsController(SubmissionService submissions, SubmissionValidator validator) : ControllerBase
{
    [HttpPost]
    [RequestSizeLimit(32_768)]
    [ProducesResponseType<CreatedSubmissionResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CreatedSubmissionResponse>> Create(
        [FromBody] CreateSubmissionRequest? request, CancellationToken cancellationToken)
    {
        if (!validator.TryValidateCreate(request, out var validated, out var errors))
            return ValidationProblem(new ValidationProblemDetails(errors));

        var result = await submissions.CreateAsync(User.GetCurrentUser(), validated!, canvasId: null, cancellationToken);
        return result.Created is null
            ? ValidationProblem(new ValidationProblemDetails(result.Errors))
            : CreatedAtAction(nameof(GetById), new { id = result.Created.Id }, result.Created);
    }

    /// <summary>The caller's own submissions, newest first.</summary>
    [HttpGet("mine")]
    [ProducesResponseType<IReadOnlyList<SubmissionSummaryResponse>>(StatusCodes.Status200OK)]
    public Task<IReadOnlyList<SubmissionSummaryResponse>> GetMine(CancellationToken cancellationToken) =>
        submissions.GetMineAsync(User.GetCurrentUser(), cancellationToken);

    /// <summary>One own submission with its timeline and conversation; 404 for someone else's.</summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType<SubmissionDetailsResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SubmissionDetailsResponse>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var submission = await submissions.GetMineAsync(User.GetCurrentUser(), id, cancellationToken);
        return submission is null ? NotFound() : submission;
    }

    [HttpPost("{id:guid}/messages")]
    [RequestSizeLimit(16_384)]
    [ProducesResponseType<SubmissionDetailsResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SubmissionDetailsResponse>> Reply(
        Guid id, [FromBody] AddMessageRequest? request, CancellationToken cancellationToken)
    {
        if (!SubmissionValidator.TryValidateMessage(request, out var body, out var errors))
            return ValidationProblem(new ValidationProblemDetails(errors));

        var submission = await submissions.ReplyAsync(User.GetCurrentUser(), id, body, cancellationToken);
        return submission is null ? NotFound() : submission;
    }
}
