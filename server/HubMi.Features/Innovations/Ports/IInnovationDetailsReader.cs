using HubMi.Domain.Innovations;

namespace HubMi.Features.Innovations.Ports;

public sealed record InnovationDetails(Innovation Innovation, InnovationCategory Category);

public interface IInnovationDetailsReader
{
    /// <summary>The published innovation with its category, or null when the id is unknown or the card is not published.</summary>
    Task<InnovationDetails?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
}
