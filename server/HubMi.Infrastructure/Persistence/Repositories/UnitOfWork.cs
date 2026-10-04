using HubMi.Features.Common.Ports;

namespace HubMi.Infrastructure.Persistence.Repositories;

internal sealed class UnitOfWork(HubMiDbContext db) : IUnitOfWork
{
    public Task SaveChangesAsync(CancellationToken cancellationToken) => db.SaveChangesAsync(cancellationToken);
}
