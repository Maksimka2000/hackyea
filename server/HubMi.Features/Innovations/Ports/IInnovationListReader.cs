namespace HubMi.Features.Innovations.Ports;

public interface IInnovationListReader
{
    /// <summary>Published cards that carry a dissemination badge first, then alphabetical; stable between calls.</summary>
    Task<IReadOnlyList<InnovationDetails>> GetFeaturedAsync(int limit, CancellationToken cancellationToken);

    /// <summary>Other published cards from the same category as <paramref name="id"/>; empty when the id is unknown.</summary>
    Task<IReadOnlyList<InnovationDetails>> GetRelatedAsync(Guid id, int limit, CancellationToken cancellationToken);
}
