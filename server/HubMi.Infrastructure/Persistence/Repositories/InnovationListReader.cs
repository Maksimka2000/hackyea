using HubMi.Features.Innovations.Ports;
using Microsoft.EntityFrameworkCore;

namespace HubMi.Infrastructure.Persistence.Repositories;

internal sealed class InnovationListReader(HubMiDbContext db) : IInnovationListReader
{
    public async Task<IReadOnlyList<InnovationDetails>> GetFeaturedAsync(int limit, CancellationToken cancellationToken)
    {
        var rows = await (
                from innovation in db.Innovations.AsNoTracking()
                join category in db.InnovationCategories on innovation.CategoryId equals category.Id
                where innovation.IsPublished
                orderby innovation.DisseminationBadge == null, innovation.Title
                select new { innovation, category })
            .Take(limit)
            .ToListAsync(cancellationToken);

        return rows.Select(row => new InnovationDetails(row.innovation, row.category)).ToList();
    }

    public async Task<IReadOnlyList<CategoryWithCount>> GetCategoriesAsync(CancellationToken cancellationToken) =>
        await db.InnovationCategories.AsNoTracking()
            .OrderBy(category => category.DisplayOrder)
            .Select(category => new CategoryWithCount(
                category.Id,
                category.Name,
                db.Innovations.Count(innovation => innovation.CategoryId == category.Id && innovation.IsPublished)))
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<InnovationDetails>> GetCatalogAsync(string? categoryId, CancellationToken cancellationToken)
    {
        var rows = await (
                from innovation in db.Innovations.AsNoTracking()
                join category in db.InnovationCategories on innovation.CategoryId equals category.Id
                where innovation.IsPublished && (categoryId == null || innovation.CategoryId == categoryId)
                orderby category.DisplayOrder, innovation.Title
                select new { innovation, category })
            .ToListAsync(cancellationToken);

        return rows.Select(row => new InnovationDetails(row.innovation, row.category)).ToList();
    }

    public async Task<IReadOnlyList<InnovationDetails>> GetRelatedAsync(Guid id, int limit, CancellationToken cancellationToken)
    {
        var categoryId = await db.Innovations.AsNoTracking()
            .Where(innovation => innovation.Id == id && innovation.IsPublished)
            .Select(innovation => innovation.CategoryId)
            .FirstOrDefaultAsync(cancellationToken);

        if (categoryId is null)
            return [];

        var rows = await (
                from innovation in db.Innovations.AsNoTracking()
                join category in db.InnovationCategories on innovation.CategoryId equals category.Id
                where innovation.IsPublished && innovation.CategoryId == categoryId && innovation.Id != id
                orderby innovation.Title
                select new { innovation, category })
            .Take(limit)
            .ToListAsync(cancellationToken);

        return rows.Select(row => new InnovationDetails(row.innovation, row.category)).ToList();
    }
}
