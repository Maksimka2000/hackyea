using HubMi.Domain.Innovations;

namespace HubMi.Features.Matching.Ports;

public interface IInnovationCategoryReader
{
    Task<IReadOnlyList<InnovationCategory>> GetAllAsync(CancellationToken cancellationToken);
}
