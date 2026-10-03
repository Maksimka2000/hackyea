namespace HubMi.Features.Innovations.Ports;

public sealed record CategoryWithCount(string Id, string Name, int InnovationCount);

public interface IInnovationListReader
{
    /// <summary>Published cards that carry a dissemination badge first, then alphabetical; stable between calls.</summary>
    Task<IReadOnlyList<InnovationDetails>> GetFeaturedAsync(int limit, CancellationToken cancellationToken);

    /// <summary>All categories in display order, each with its number of published cards.</summary>
    Task<IReadOnlyList<CategoryWithCount>> GetCategoriesAsync(CancellationToken cancellationToken);

    /// <summary>Published cards (all, or only those of one category), ordered by category display order, then title.</summary>
    Task<IReadOnlyList<InnovationDetails>> GetCatalogAsync(string? categoryId, CancellationToken cancellationToken);

    /// <summary>Other published cards from the same category as <paramref name="id"/>; empty when the id is unknown.</summary>
    Task<IReadOnlyList<InnovationDetails>> GetRelatedAsync(Guid id, int limit, CancellationToken cancellationToken);
}
