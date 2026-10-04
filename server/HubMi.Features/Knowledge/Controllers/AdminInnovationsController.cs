using HubMi.Domain.Accounts;
using HubMi.Domain.Innovations;
using HubMi.Features.Accounts;
using HubMi.Features.Knowledge.Contracts;
using HubMi.Features.Knowledge.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HubMi.Features.Knowledge.Controllers;

/// <summary>Staff: add, edit, verify and publish library cards. New cards start as drafts; only verified cards can be published.</summary>
[ApiController]
[Authorize(Roles = AccountRoles.Admin)]
[Route("api/admin/innovations")]
public sealed class AdminInnovationsController(InnovationEditingService editing) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<AdminInnovationRowResponse>>(StatusCodes.Status200OK)]
    public Task<IReadOnlyList<AdminInnovationRowResponse>> GetAll(
        [FromQuery] PublicationStatus? status, [FromQuery] string? categoryId, [FromQuery] string? q, CancellationToken cancellationToken) =>
        editing.ListAsync(status, categoryId, q, cancellationToken);

    [HttpGet("{id:guid}")]
    [ProducesResponseType<AdminInnovationResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AdminInnovationResponse>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var card = await editing.GetAsync(id, cancellationToken);
        return card is null ? NotFound() : card;
    }

    [HttpPost]
    [ProducesResponseType<CreatedResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CreatedResponse>> Create([FromBody] InnovationInput input, CancellationToken cancellationToken)
    {
        var (id, errors) = await editing.CreateDraftAsync(input, cancellationToken);
        return id is null
            ? ValidationProblem(new ValidationProblemDetails(errors))
            : CreatedAtAction(nameof(GetById), new { id }, new CreatedResponse(id.Value));
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] InnovationInput input, CancellationToken cancellationToken) =>
        this.ToActionResult(await editing.UpdateAsync(id, input, cancellationToken));

    /// <summary><c>step</c>: verify, publish or unpublish.</summary>
    [HttpPost("{id:guid}/{step:regex(^(verify|publish|unpublish)$)}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ChangePublication(Guid id, string step, CancellationToken cancellationToken)
    {
        if (!EditResultExtensions.TryParseAction(step, out var parsed))
            return NotFound();
        return this.ToActionResult(await editing.ChangePublicationAsync(id, parsed, User.GetCurrentUser().Id, cancellationToken));
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken) =>
        this.ToActionResult(await editing.DeleteAsync(id, cancellationToken));
}
