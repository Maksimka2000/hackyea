using HubMi.Domain.Matching;
using HubMi.Features.Matching.Ports;

namespace HubMi.Infrastructure.Persistence.Repositories;

internal sealed class MatchRequestLog(HubMiDbContext db) : IMatchRequestLog
{
    public async Task SaveAsync(MatchRequest request, CancellationToken cancellationToken)
    {
        db.MatchRequests.Add(request);
        await db.SaveChangesAsync(cancellationToken);
    }
}
