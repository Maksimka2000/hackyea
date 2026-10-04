using HubMi.Domain.Accounts;
using HubMi.Features.Knowledge.Contracts;
using HubMi.Features.Knowledge.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HubMi.Features.Knowledge.Controllers;

/// <summary>Staff: challenges and educational materials of the knowledge store, with the same draft → verified → published flow.</summary>
[ApiController]
[Authorize(Roles = AccountRoles.Admin)]
[Route("api/admin")]
public sealed class AdminKnowledgeController(KnowledgeContentService content) : ControllerBase
{
    [HttpGet("challenges")]
    [ProducesResponseType<IReadOnlyList<ChallengeResponse>>(StatusCodes.Status200OK)]
    public Task<IReadOnlyList<ChallengeResponse>> GetChallenges(CancellationToken cancellationToken) =>
        content.GetChallengesAsync(publishedOnly: false, cancellationToken);

    [HttpPost("challenges")]
    [ProducesResponseType<CreatedResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CreatedResponse>> CreateChallenge([FromBody] ChallengeInput input, CancellationToken cancellationToken)
    {
        var (id, errors) = await content.CreateChallengeAsync(input, cancellationToken);
        return id is null ? ValidationProblem(new ValidationProblemDetails(errors)) : new CreatedResponse(id.Value);
    }

    [HttpPut("challenges/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateChallenge(Guid id, [FromBody] ChallengeInput input, CancellationToken cancellationToken) =>
        this.ToActionResult(await content.UpdateChallengeAsync(id, input, cancellationToken));

    [HttpPost("challenges/{id:guid}/{step:regex(^(verify|publish|unpublish)$)}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ChangeChallenge(Guid id, string step, CancellationToken cancellationToken) =>
        EditResultExtensions.TryParseAction(step, out var parsed)
            ? this.ToActionResult(await content.ChangeChallengeAsync(id, parsed, cancellationToken))
            : NotFound();

    [HttpDelete("challenges/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteChallenge(Guid id, CancellationToken cancellationToken) =>
        this.ToActionResult(await content.DeleteChallengeAsync(id, cancellationToken));

    [HttpGet("materials")]
    [ProducesResponseType<IReadOnlyList<MaterialResponse>>(StatusCodes.Status200OK)]
    public Task<IReadOnlyList<MaterialResponse>> GetMaterials(CancellationToken cancellationToken) =>
        content.GetMaterialsAsync(publishedOnly: false, cancellationToken);

    [HttpPost("materials")]
    [ProducesResponseType<CreatedResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CreatedResponse>> CreateMaterial([FromBody] MaterialInput input, CancellationToken cancellationToken)
    {
        var (id, errors) = await content.CreateMaterialAsync(input, cancellationToken);
        return id is null ? ValidationProblem(new ValidationProblemDetails(errors)) : new CreatedResponse(id.Value);
    }

    [HttpPut("materials/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateMaterial(Guid id, [FromBody] MaterialInput input, CancellationToken cancellationToken) =>
        this.ToActionResult(await content.UpdateMaterialAsync(id, input, cancellationToken));

    [HttpPost("materials/{id:guid}/{step:regex(^(verify|publish|unpublish)$)}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ChangeMaterial(Guid id, string step, CancellationToken cancellationToken) =>
        EditResultExtensions.TryParseAction(step, out var parsed)
            ? this.ToActionResult(await content.ChangeMaterialAsync(id, parsed, cancellationToken))
            : NotFound();

    [HttpDelete("materials/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteMaterial(Guid id, CancellationToken cancellationToken) =>
        this.ToActionResult(await content.DeleteMaterialAsync(id, cancellationToken));
}
