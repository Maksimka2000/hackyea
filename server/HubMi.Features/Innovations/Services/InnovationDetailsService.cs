using HubMi.Features.Innovations.Contracts;
using HubMi.Features.Innovations.Ports;

namespace HubMi.Features.Innovations.Services;

/// <summary>Get one innovation card with all its data.</summary>
public sealed class InnovationDetailsService(IInnovationDetailsReader reader, IInnovationRatingReader ratings)
{
    public async Task<InnovationDetailsResponse?> GetAsync(Guid id, CancellationToken cancellationToken)
    {
        var details = await reader.GetByIdAsync(id, cancellationToken);
        if (details is null)
            return null;

        var card = details.Innovation;
        var rating = (await ratings.GetAsync([card.Id], cancellationToken)).GetValueOrDefault(card.Id);
        return new InnovationDetailsResponse(
            card.Id,
            card.Title,
            card.Tagline,
            new InnovationCategoryDto(details.Category.Id, details.Category.Name),
            card.Solution,
            card.Problems,
            card.TargetGroup,
            card.Beneficiaries,
            card.Evidence,
            card.DisseminationBadge,
            card.SourceUrl,
            card.VideoUrl,
            card.MaterialsUrl,
            card.DetailsPdfUrl,
            card.LicenseUrl,
            card.UpdatedAt,
            rating?.Average,
            rating?.Count ?? 0);
    }
}
