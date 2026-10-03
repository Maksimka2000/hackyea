using HubMi.Domain.Matching;

namespace HubMi.Features.Matching.Ports;

public interface IMatchRequestLog
{
    Task SaveAsync(MatchRequest request, CancellationToken cancellationToken);
}
