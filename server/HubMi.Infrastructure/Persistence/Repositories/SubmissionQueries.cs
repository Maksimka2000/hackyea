using HubMi.Domain.Submissions;
using HubMi.Features.Submissions.Ports;
using Microsoft.EntityFrameworkCore;

namespace HubMi.Infrastructure.Persistence.Repositories;

internal sealed class SubmissionQueries(HubMiDbContext db) : ISubmissionQueries
{
    public Task<Submission?> GetAsync(Guid id, CancellationToken cancellationToken) =>
        db.Submissions.AsNoTracking()
            .Include(s => s.Messages)
            .Include(s => s.StatusChanges)
            .Include(s => s.Links)
            .AsSplitQuery()
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

    public async Task<IReadOnlyList<SubmissionRow>> GetByAuthorAsync(Guid authorId, CancellationToken cancellationToken) =>
        await ToRows(db.Submissions.AsNoTracking().Where(s => s.AuthorId == authorId).OrderByDescending(s => s.CreatedAt))
            .ToListAsync(cancellationToken);

    public async Task<(IReadOnlyList<SubmissionRow> Rows, int Total)> SearchAsync(SubmissionFilter filter, CancellationToken cancellationToken)
    {
        var query = db.Submissions.AsNoTracking();
        if (filter.Status is { } status)
            query = query.Where(s => s.Status == status);
        if (filter.Type is { } type)
            query = query.Where(s => s.Type == type);
        if (!string.IsNullOrWhiteSpace(filter.CategoryId))
            query = query.Where(s => s.CategoryId == filter.CategoryId);
        if (filter.UnseenOnly)
            query = query.Where(s => s.SeenByAdminAt == null);
        if (filter.Query is { } text)
        {
            var pattern = $"%{text.Replace("\\", "\\\\").Replace("%", "\\%").Replace("_", "\\_")}%";
            query = query.Where(s =>
                EF.Functions.ILike(s.Number, pattern) || EF.Functions.ILike(s.Title, pattern) || EF.Functions.ILike(s.Description, pattern));
        }

        var total = await query.CountAsync(cancellationToken);
        var rows = await ToRows(query.OrderByDescending(s => s.CreatedAt))
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync(cancellationToken);

        return (rows, total);
    }

    public async Task<IReadOnlyList<LinkedInnovation>> GetInnovationsAsync(IReadOnlyCollection<Guid> ids, CancellationToken cancellationToken)
    {
        if (ids.Count == 0)
            return [];

        return await db.Innovations.AsNoTracking()
            .Where(i => ids.Contains(i.Id))
            .Select(i => new LinkedInnovation(i.Id, i.Title, i.CategoryId))
            .ToListAsync(cancellationToken);
    }

    public async Task<ResponseTimeStats> GetResponseTimeAsync(DateTime? from, DateTime? to, CancellationToken cancellationToken)
    {
        var query = db.Submissions.AsNoTracking();
        if (from is not null)
            query = query.Where(s => s.CreatedAt >= from);
        if (to is not null)
            query = query.Where(s => s.CreatedAt <= to);

        var answered = await query
            .Where(s => s.FirstResponseAt != null)
            .Select(s => new { s.CreatedAt, FirstResponseAt = s.FirstResponseAt!.Value })
            .ToListAsync(cancellationToken);
        var hours = answered.Select(a => (a.FirstResponseAt - a.CreatedAt).TotalHours).OrderBy(h => h).ToList();

        var open = query.Where(s => s.FirstResponseAt == null
                                    && s.Status != SubmissionStatus.Closed && s.Status != SubmissionStatus.Rejected);
        var waiting = await open.CountAsync(cancellationToken);
        var oldest = await open.MinAsync(s => (DateTime?)s.CreatedAt, cancellationToken);
        var unseen = await query.CountAsync(s => s.SeenByAdminAt == null, cancellationToken);

        return new ResponseTimeStats(
            hours.Count == 0 ? null : Math.Round(hours.Average(), 1),
            hours.Count == 0 ? null : Math.Round(Median(hours), 1),
            hours.Count,
            waiting,
            oldest,
            unseen);
    }

    private static double Median(IReadOnlyList<double> sorted) =>
        sorted.Count % 2 == 1 ? sorted[sorted.Count / 2] : (sorted[sorted.Count / 2 - 1] + sorted[sorted.Count / 2]) / 2;

    private static IQueryable<SubmissionRow> ToRows(IQueryable<Submission> query) =>
        query.Select(s => new SubmissionRow(
            s.Id,
            s.Number,
            s.Type,
            s.Title,
            s.Status,
            s.CategoryId,
            s.AuthorId,
            s.AuthorRole,
            s.CreatedAt,
            s.UpdatedAt,
            s.SeenByAdminAt,
            s.FirstResponseAt,
            s.Messages.Count));
}
