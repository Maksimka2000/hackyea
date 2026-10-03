using HubMi.Domain.Innovations;
using HubMi.Features.Matching.Ports;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace HubMi.Infrastructure.Persistence.Repositories;

internal sealed class InnovationCategoryReader(HubMiDbContext db, IMemoryCache cache) : IInnovationCategoryReader
{
    public async Task<IReadOnlyList<InnovationCategory>> GetAllAsync(CancellationToken cancellationToken) =>
        (await cache.GetOrCreateAsync("categories", async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10);
            return await db.InnovationCategories.AsNoTracking().OrderBy(c => c.DisplayOrder).ToListAsync(cancellationToken);
        }))!;
}
