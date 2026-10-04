using HubMi.Domain.Accounts;
using HubMi.Features.Accounts;
using HubMi.Features.Canvases.Contracts;
using HubMi.Features.Canvases.Services;
using HubMi.Features.Submissions.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HubMi.Features.Canvases.Controllers;

/// <summary>Social Innovation Canvases of the signed-in user. Templates are public so the boards can be previewed.</summary>
[ApiController]
[Route("api")]
public sealed class CanvasesController(CanvasService canvases) : ControllerBase
{
    [HttpGet("canvas-templates")]
    [AllowAnonymous]
    [ProducesResponseType<IReadOnlyList<CanvasTemplateResponse>>(StatusCodes.Status200OK)]
    public Task<IReadOnlyList<CanvasTemplateResponse>> GetTemplates(CancellationToken cancellationToken) =>
        canvases.GetTemplatesAsync(cancellationToken);

    [HttpGet("canvases")]
    [Authorize(Roles = AccountRoles.Submitters)]
    [ProducesResponseType<IReadOnlyList<CanvasSummaryResponse>>(StatusCodes.Status200OK)]
    public Task<IReadOnlyList<CanvasSummaryResponse>> GetMine(CancellationToken cancellationToken) =>
        canvases.GetMineAsync(User.GetCurrentUser(), cancellationToken);

    [HttpPost("canvases")]
    [Authorize(Roles = AccountRoles.Submitters)]
    [ProducesResponseType<CanvasResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CanvasResponse>> Create([FromBody] CreateCanvasRequest? request, CancellationToken cancellationToken)
    {
        var result = await canvases.CreateAsync(User.GetCurrentUser(), request ?? new CreateCanvasRequest(), cancellationToken);
        return result.Canvas is null
            ? ValidationProblem(new ValidationProblemDetails(result.Errors))
            : CreatedAtAction(nameof(GetById), new { id = result.Canvas.Id }, result.Canvas);
    }

    [HttpGet("canvases/{id:guid}")]
    [Authorize(Roles = AccountRoles.Submitters)]
    [ProducesResponseType<CanvasResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CanvasResponse>> GetById(Guid id, CancellationToken cancellationToken) =>
        ToResult(await canvases.GetAsync(User.GetCurrentUser(), id, cancellationToken));

    /// <summary>Saves the title and/or the whole content. The response carries non-blocking warnings.</summary>
    [HttpPut("canvases/{id:guid}")]
    [Authorize(Roles = AccountRoles.Submitters)]
    [RequestSizeLimit(131_072)]
    [ProducesResponseType<CanvasResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CanvasResponse>> Update(Guid id, [FromBody] UpdateCanvasRequest? request, CancellationToken cancellationToken) =>
        ToResult(await canvases.UpdateAsync(User.GetCurrentUser(), id, request ?? new UpdateCanvasRequest(), cancellationToken));

    [HttpDelete("canvases/{id:guid}")]
    [Authorize(Roles = AccountRoles.Submitters)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken) =>
        await canvases.DeleteAsync(User.GetCurrentUser(), id, cancellationToken) ? NoContent() : NotFound();

    /// <summary>Sends the canvas to ROPS as an idea submission (once).</summary>
    [HttpPost("canvases/{id:guid}/submit")]
    [Authorize(Roles = AccountRoles.Submitters)]
    [ProducesResponseType<CreatedSubmissionResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CreatedSubmissionResponse>> Submit(Guid id, CancellationToken cancellationToken)
    {
        var (submissionId, number, result) = await canvases.SubmitAsync(User.GetCurrentUser(), id, cancellationToken);
        if (!result.Found)
            return NotFound();
        return submissionId is null
            ? ValidationProblem(new ValidationProblemDetails(result.Errors))
            : new CreatedSubmissionResponse(submissionId.Value, number!);
    }

    private ActionResult<CanvasResponse> ToResult(CanvasResult result) =>
        !result.Found ? NotFound()
        : result.Errors.Count > 0 ? ValidationProblem(new ValidationProblemDetails(result.Errors))
        : result.Canvas!;
}
