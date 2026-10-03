using HubMi.Features.Innovations.Ports;
using Microsoft.EntityFrameworkCore;

namespace HubMi.Infrastructure.Persistence.Repositories;

internal sealed class InnovationDetailsReader(HubMiDbContext db) : IInnovationDetailsReader
{
    public async Task<InnovationDetails?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var row = await (
                from innovation in db.Innovations.AsNoTracking()
                join category in db.InnovationCategories on innovation.CategoryId equals category.Id
                where innovation.Id == id && innovation.IsPublished
                select new { innovation, category })
            .FirstOrDefaultAsync(cancellationToken);

        return row is null ? null : new InnovationDetails(row.innovation, row.category);
    }
}
