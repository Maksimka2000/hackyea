using HubMi.Features.Innovations.Contracts;
using HubMi.Features.Innovations.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HubMi.Features.Innovations.Controllers;

[ApiController]
[Route("api/innovations")]
public sealed class InnovationsController(InnovationDetailsService details, InnovationListService lists) : ControllerBase
{
    /// <summary>Public and anonymous: one innovation card with all its data. The id is the innovation's GUID, as returned by matching.</summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType<InnovationDetailsResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<InnovationDetailsResponse>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var innovation = await details.GetAsync(id, cancellationToken);
        return innovation is null ? NotFound() : innovation;
    }

    /// <summary>Public and anonymous: a few cards to show on the home page.</summary>
    [HttpGet("featured")]
    [ProducesResponseType<IReadOnlyList<InnovationSummaryResponse>>(StatusCodes.Status200OK)]
    public async Task<IReadOnlyList<InnovationSummaryResponse>> GetFeatured(CancellationToken cancellationToken) =>
        await lists.GetFeaturedAsync(cancellationToken);

    /// <summary>Public and anonymous: other cards from the same category. Empty for an unknown id.</summary>
    [HttpGet("{id:guid}/related")]
    [ProducesResponseType<IReadOnlyList<InnovationSummaryResponse>>(StatusCodes.Status200OK)]
    public async Task<IReadOnlyList<InnovationSummaryResponse>> GetRelated(Guid id, CancellationToken cancellationToken) =>
        await lists.GetRelatedAsync(id, cancellationToken);
}
