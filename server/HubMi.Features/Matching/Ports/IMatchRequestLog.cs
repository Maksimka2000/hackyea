using HubMi.Domain.Innovations;

namespace HubMi.Features.Matching.Ports;

public interface IMatchRequestLog
{
    Task SaveAsync(MatchRequest request, CancellationToken cancellationToken);
}
