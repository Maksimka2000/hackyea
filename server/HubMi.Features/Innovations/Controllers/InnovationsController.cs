using HubMi.Features.Innovations.Contracts;
using HubMi.Features.Innovations.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HubMi.Features.Innovations.Controllers;

[ApiController]
[Route("api/innovations")]
public sealed class InnovationsController(InnovationDetailsService details) : ControllerBase
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
}
