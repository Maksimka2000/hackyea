using HubMi.Features.Innovations.Contracts;
using HubMi.Features.Innovations.Ports;

namespace HubMi.Features.Innovations.Services;

/// <summary>Short lists of cards: the featured ones for the home page and the related ones for a detail page.</summary>
public sealed class InnovationListService(IInnovationListReader reader, IInnovationRatingReader ratings)
{
    private const int FeaturedLimit = 3;
    private const int RelatedLimit = 3;

    public async Task<IReadOnlyList<InnovationSummaryResponse>> GetFeaturedAsync(CancellationToken cancellationToken) =>
        await ToSummariesAsync(await reader.GetFeaturedAsync(FeaturedLimit, cancellationToken), cancellationToken);

    public async Task<IReadOnlyList<InnovationSummaryResponse>> GetRelatedAsync(Guid id, CancellationToken cancellationToken) =>
        await ToSummariesAsync(await reader.GetRelatedAsync(id, RelatedLimit, cancellationToken), cancellationToken);

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

        return await ToSummariesAsync(await reader.GetCatalogAsync(id, cancellationToken), cancellationToken);
    }

    private async Task<IReadOnlyList<InnovationSummaryResponse>> ToSummariesAsync(
        IReadOnlyList<InnovationDetails> rows, CancellationToken cancellationToken)
    {
        var averages = await ratings.GetAsync(rows.Select(row => row.Innovation.Id).ToList(), cancellationToken);
        return rows.Select(row => new InnovationSummaryResponse(
                row.Innovation.Id,
                row.Innovation.Title,
                row.Innovation.Tagline,
                new InnovationCategoryDto(row.Category.Id, row.Category.Name),
                row.Innovation.DisseminationBadge,
                !string.IsNullOrWhiteSpace(row.Innovation.VideoUrl),
                !string.IsNullOrWhiteSpace(row.Innovation.Evidence),
                averages.GetValueOrDefault(row.Innovation.Id)?.Average,
                averages.GetValueOrDefault(row.Innovation.Id)?.Count ?? 0))
            .ToList();
    }
}
