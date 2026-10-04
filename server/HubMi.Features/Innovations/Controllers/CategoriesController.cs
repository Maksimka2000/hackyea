using HubMi.Features.Innovations.Contracts;
using HubMi.Features.Innovations.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HubMi.Features.Innovations.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/categories")]
public sealed class CategoriesController(InnovationListService lists) : ControllerBase
{
    /// <summary>Public and anonymous: the library categories in display order, each with its number of published cards.</summary>
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<InnovationCategorySummaryResponse>>(StatusCodes.Status200OK)]
    public async Task<IReadOnlyList<InnovationCategorySummaryResponse>> GetAll(CancellationToken cancellationToken) =>
        await lists.GetCategoriesAsync(cancellationToken);
}
