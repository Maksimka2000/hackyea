using HubMi.Domain.Submissions;
using HubMi.Domain.Testing;
using HubMi.Features.Admin.Ports;
using Microsoft.EntityFrameworkCore;

namespace HubMi.Infrastructure.Persistence.Repositories;

internal sealed class TrendQueries(HubMiDbContext db) : ITrendQueries
{
    public async Task<IReadOnlyList<CategoryTypeCount>> CountByCategoryAsync(TrendWindow window, CancellationToken cancellationToken) =>
        await Window(window)
            .GroupBy(s => new { s.CategoryId, s.Type, s.Status })
            .Select(g => new CategoryTypeCount(g.Key.CategoryId, g.Key.Type, g.Key.Status, g.Count()))
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<WeekCount>> CountByWeekAsync(TrendWindow window, CancellationToken cancellationToken)
    {
        // Few rows per window: group the days in memory so the week arithmetic stays plain C#.
        var days = await Window(window)
            .GroupBy(s => new { s.CreatedAt.Date, s.Type })
            .Select(g => new { g.Key.Date, g.Key.Type, Count = g.Count() })
            .ToListAsync(cancellationToken);

        return days
            .GroupBy(d => new { Week = WeekStart(d.Date), d.Type })
            .Select(g => new WeekCount(g.Key.Week, g.Key.Type, g.Sum(x => x.Count)))
            .ToList();
    }

    public async Task<IReadOnlyList<RoleCount>> CountByRoleAsync(TrendWindow window, CancellationToken cancellationToken) =>
        await Window(window)
            .GroupBy(s => s.AuthorRole)
            .Select(g => new RoleCount(g.Key, g.Count()))
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<UnmatchedQuery>> TopUnmatchedQueriesAsync(
        DateTime? from, DateTime? to, int limit, CancellationToken cancellationToken)
    {
        var requests = db.MatchRequests.AsNoTracking().Where(r => !r.Results.Any());
        if (from is not null)
            requests = requests.Where(r => r.ReceivedAt >= from);
        if (to is not null)
            requests = requests.Where(r => r.ReceivedAt <= to);

        var rows = await requests
            .GroupBy(r => r.Text.Trim().ToLower())
            .Select(g => new { Text = g.Key, Count = g.Count(), LastAskedAt = g.Max(r => r.ReceivedAt) })
            .OrderByDescending(q => q.Count).ThenByDescending(q => q.LastAskedAt)
            .Take(limit)
            .ToListAsync(cancellationToken);

        return rows.Select(r => new UnmatchedQuery(r.Text, r.Count, r.LastAskedAt)).ToList();
    }

    public Task<int> CountNewFeedbackAsync(CancellationToken cancellationToken) =>
        db.InnovationFeedback.CountAsync(f => f.Status == FeedbackStatus.New, cancellationToken);

    private IQueryable<Submission> Window(TrendWindow window)
    {
        var query = db.Submissions.AsNoTracking();
        if (window.From is not null)
            query = query.Where(s => s.CreatedAt >= window.From);
        if (window.To is not null)
            query = query.Where(s => s.CreatedAt <= window.To);
        if (window.Type is { } type)
            query = query.Where(s => s.Type == type);
        return query;
    }

    private static DateOnly WeekStart(DateTime day)
    {
        var date = DateOnly.FromDateTime(day);
        var offset = ((int)date.DayOfWeek + 6) % 7;
        return date.AddDays(-offset);
    }
}
