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

    public async Task<IReadOnlyList<InnovationCategorySummaryResponse>> GetCategoriesAsync(CancellationToken cancellationToken) =>
        (await reader.GetCategoriesAsync(cancellationToken))
        .Select(category => new InnovationCategorySummaryResponse(category.Id, category.Name, category.InnovationCount))
        .ToList();

    /// <summary>The catalogue, optionally narrowed to one category. Null when the category does not exist.</summary>
    public async Task<IReadOnlyList<InnovationSummaryResponse>?> GetCatalogAsync(string? categoryId, CancellationToken cancellationToken)
    {
        var id = string.IsNullOrWhiteSpace(categoryId) ? null : categoryId.Trim();
        if (id is not null)
        {
            var categories = await reader.GetCategoriesAsync(cancellationToken);
            if (categories.All(category => !string.Equals(category.Id, id, StringComparison.Ordinal)))
                return null;
        }

        return ToSummaries(await reader.GetCatalogAsync(id, cancellationToken));
    }

    private static List<InnovationSummaryResponse> ToSummaries(IReadOnlyList<InnovationDetails> rows) =>
        rows.Select(row => new InnovationSummaryResponse(
                row.Innovation.Id,
                row.Innovation.Title,
                row.Innovation.Tagline,
                new InnovationCategoryDto(row.Category.Id, row.Category.Name),
                row.Innovation.DisseminationBadge,
                !string.IsNullOrWhiteSpace(row.Innovation.VideoUrl),
                !string.IsNullOrWhiteSpace(row.Innovation.Evidence)))
            .ToList();
}
