using HubMi.Features.Knowledge.Contracts;
using HubMi.Features.Knowledge.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HubMi.Features.Knowledge.Controllers;

/// <summary>Public and anonymous: the published part of the knowledge store.</summary>
[ApiController]
[AllowAnonymous]
[Route("api")]
public sealed class KnowledgeController(KnowledgeContentService content) : ControllerBase
{
    /// <summary>Published Małopolska social challenges.</summary>
    [HttpGet("challenges")]
    [ProducesResponseType<IReadOnlyList<ChallengeResponse>>(StatusCodes.Status200OK)]
    public Task<IReadOnlyList<ChallengeResponse>> GetChallenges(CancellationToken cancellationToken) =>
        content.GetChallengesAsync(publishedOnly: true, cancellationToken);

    /// <summary>Published educational materials.</summary>
    [HttpGet("materials")]
    [ProducesResponseType<IReadOnlyList<MaterialResponse>>(StatusCodes.Status200OK)]
    public Task<IReadOnlyList<MaterialResponse>> GetMaterials(CancellationToken cancellationToken) =>
        content.GetMaterialsAsync(publishedOnly: true, cancellationToken);
}
