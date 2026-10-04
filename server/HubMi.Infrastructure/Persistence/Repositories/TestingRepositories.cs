using HubMi.Domain.Testing;
using HubMi.Features.Innovations.Ports;
using HubMi.Features.Testing.Ports;
using Microsoft.EntityFrameworkCore;

namespace HubMi.Infrastructure.Persistence.Repositories;

internal sealed class RatingStore(HubMiDbContext db) : IRatingStore
{
    public void Add(InnovationRating rating) => db.InnovationRatings.Add(rating);

    public Task<InnovationRating?> FindForUpdateAsync(Guid innovationId, Guid userId, CancellationToken cancellationToken) =>
        db.InnovationRatings.FirstOrDefaultAsync(r => r.InnovationId == innovationId && r.UserId == userId, cancellationToken);
}

internal sealed class FeedbackStore(HubMiDbContext db) : IFeedbackStore
{
    public void Add(InnovationFeedback feedback) => db.InnovationFeedback.Add(feedback);

    public Task<InnovationFeedback?> FindForUpdateAsync(Guid id, CancellationToken cancellationToken) =>
        db.InnovationFeedback.FirstOrDefaultAsync(f => f.Id == id, cancellationToken);
}

internal sealed class TestingQueries(HubMiDbContext db) : ITestingQueries, IInnovationRatingReader
{
    public async Task<IReadOnlyList<RatedInnovation>> GetRatingOverviewAsync(CancellationToken cancellationToken)
    {
        var ratings = await db.InnovationRatings.AsNoTracking()
            .GroupBy(r => r.InnovationId)
            .Select(g => new { InnovationId = g.Key, Average = g.Average(r => (double)r.Stars), Count = g.Count() })
            .OrderByDescending(r => r.Count).ThenByDescending(r => r.Average)
            .Take(200)
            .ToListAsync(cancellationToken);

        var ids = ratings.Select(r => r.InnovationId).ToList();
        var titles = await db.Innovations.AsNoTracking()
            .Where(i => ids.Contains(i.Id))
            .ToDictionaryAsync(i => i.Id, i => i.Title, cancellationToken);
        var open = await db.InnovationFeedback.AsNoTracking()
            .Where(f => f.Status == FeedbackStatus.New && ids.Contains(f.InnovationId))
            .GroupBy(f => f.InnovationId)
            .Select(g => new { InnovationId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.InnovationId, x => x.Count, cancellationToken);

        return ratings
            .Where(r => titles.ContainsKey(r.InnovationId))
            .Select(r => new RatedInnovation(r.InnovationId, titles[r.InnovationId], Math.Round(r.Average, 1), r.Count, open.GetValueOrDefault(r.InnovationId)))
            .ToList();
    }

    public Task<string?> GetInnovationTitleAsync(Guid innovationId, CancellationToken cancellationToken) =>
        db.Innovations.AsNoTracking().Where(i => i.Id == innovationId).Select(i => i.Title).FirstOrDefaultAsync(cancellationToken);

    public async Task<RatingSummary> GetSummaryAsync(Guid innovationId, CancellationToken cancellationToken)
    {
        var counts = await db.InnovationRatings.AsNoTracking()
            .Where(r => r.InnovationId == innovationId)
            .GroupBy(r => r.Stars)
            .Select(g => new { Stars = g.Key, Count = g.Count() })
            .ToListAsync(cancellationToken);

        var distribution = Enumerable.Range(InnovationRating.MinStars, InnovationRating.MaxStars)
            .Select(stars => counts.FirstOrDefault(c => c.Stars == stars)?.Count ?? 0)
            .ToList();
        var total = distribution.Sum();
        double? average = total == 0 ? null : Math.Round(counts.Sum(c => c.Stars * c.Count) / (double)total, 1);

        return new RatingSummary(average, total, distribution);
    }

    public Task<int?> GetStarsAsync(Guid innovationId, Guid userId, CancellationToken cancellationToken) =>
        db.InnovationRatings.AsNoTracking()
            .Where(r => r.InnovationId == innovationId && r.UserId == userId)
            .Select(r => (int?)r.Stars)
            .FirstOrDefaultAsync(cancellationToken);

    public async Task<IReadOnlyList<FeedbackRow>> GetFeedbackByUserAsync(Guid userId, CancellationToken cancellationToken) =>
        await Rows(db.InnovationFeedback.AsNoTracking().Where(f => f.UserId == userId)).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<FeedbackRow>> GetFeedbackAsync(FeedbackKind? kind, FeedbackStatus? status, CancellationToken cancellationToken)
    {
        var query = db.InnovationFeedback.AsNoTracking();
        if (kind is { } k)
            query = query.Where(f => f.Kind == k);
        if (status is { } s)
            query = query.Where(f => f.Status == s);
        return await Rows(query).Take(500).ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyDictionary<Guid, InnovationRatingAverage>> GetAsync(
        IReadOnlyCollection<Guid> innovationIds, CancellationToken cancellationToken)
    {
        if (innovationIds.Count == 0)
            return new Dictionary<Guid, InnovationRatingAverage>();

        return await db.InnovationRatings.AsNoTracking()
            .Where(r => innovationIds.Contains(r.InnovationId))
            .GroupBy(r => r.InnovationId)
            .Select(g => new { g.Key, Average = g.Average(r => (double)r.Stars), Count = g.Count() })
            .ToDictionaryAsync(x => x.Key, x => new InnovationRatingAverage(Math.Round(x.Average, 1), x.Count), cancellationToken);
    }

    private IQueryable<FeedbackRow> Rows(IQueryable<InnovationFeedback> query) =>
        from f in query
        join i in db.Innovations on f.InnovationId equals i.Id
        orderby f.CreatedAt descending
        select new FeedbackRow(f.Id, f.InnovationId, i.Title, f.UserId, f.Kind, f.Body, f.Status, f.StaffNote, f.CreatedAt, f.ReviewedAt);
}
