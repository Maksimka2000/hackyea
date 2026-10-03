using HubMi.Features.Innovations.Contracts;
using HubMi.Features.Innovations.Ports;

namespace HubMi.Features.Innovations.Services;

/// <summary>Short lists of cards: the featured ones for the home page and the related ones for a detail page.</summary>
public sealed class InnovationListService(IInnovationListReader reader)
{
    private const int FeaturedLimit = 3;
    private const int RelatedLimit = 3;

    public async Task<IReadOnlyList<InnovationSummaryResponse>> GetFeaturedAsync(CancellationToken cancellationToken) =>
        ToSummaries(await reader.GetFeaturedAsync(FeaturedLimit, cancellationToken));

    public async Task<IReadOnlyList<InnovationSummaryResponse>> GetRelatedAsync(Guid id, CancellationToken cancellationToken) =>
        ToSummaries(await reader.GetRelatedAsync(id, RelatedLimit, cancellationToken));

    private static List<InnovationSummaryResponse> ToSummaries(IReadOnlyList<InnovationDetails> rows) =>
        rows.Select(row => new InnovationSummaryResponse(
                row.Innovation.Id,
                row.Innovation.Title,
                row.Innovation.Tagline,
                new InnovationCategoryDto(row.Category.Id, row.Category.Name)))
            .ToList();
}
