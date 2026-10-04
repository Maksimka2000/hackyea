using HubMi.Domain.Canvases;
using HubMi.Features.Canvases.Ports;
using Microsoft.EntityFrameworkCore;

namespace HubMi.Infrastructure.Persistence.Repositories;

internal sealed class CanvasStore(HubMiDbContext db) : ICanvasStore, ICanvasQueries
{
    public void Add(InnovationCanvas canvas) => db.Canvases.Add(canvas);

    public void Remove(InnovationCanvas canvas) => db.Canvases.Remove(canvas);

    public Task<InnovationCanvas?> FindForUpdateAsync(Guid id, CancellationToken cancellationToken) =>
        db.Canvases.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

    public async Task<IReadOnlyList<InnovationCanvas>> GetByOwnerAsync(Guid ownerId, CancellationToken cancellationToken) =>
        await db.Canvases.AsNoTracking().Where(c => c.OwnerId == ownerId).OrderByDescending(c => c.UpdatedAt).ToListAsync(cancellationToken);

    public Task<InnovationCanvas?> GetAsync(Guid id, CancellationToken cancellationToken) =>
        db.Canvases.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
}
