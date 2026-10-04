using HubMi.Domain.Submissions;
using HubMi.Features.Admin.Contracts;
using HubMi.Features.Admin.Ports;
using HubMi.Features.Matching.Ports;
using HubMi.Features.Submissions.Contracts;
using HubMi.Features.Submissions.Ports;

namespace HubMi.Features.Admin.Services;

/// <summary>Aggregated needs by area, over time and by kind of submitter, plus what people searched for and did not find.</summary>
public sealed class TrendService(
    ITrendQueries trends,
    ISubmissionQueries submissions,
    IInnovationCategoryReader categories)
{
    public const int UnmatchedLimit = 10;
    public const string UncategorisedName = "Bez kategorii";

    public async Task<TrendsResponse> GetAsync(TrendWindow window, CancellationToken cancellationToken)
    {
        var allCategories = await categories.GetAllAsync(cancellationToken);
        var counts = await trends.CountByCategoryAsync(window, cancellationToken);
        var weeks = await trends.CountByWeekAsync(window, cancellationToken);
        var roles = await trends.CountByRoleAsync(window, cancellationToken);
        var unmatched = await trends.TopUnmatchedQueriesAsync(window.From, window.To, UnmatchedLimit, cancellationToken);
        var responseTime = await submissions.GetResponseTimeAsync(window.From, window.To, cancellationToken);

        var byCategory = allCategories
            .Select(c => ToCategory(c.Id, c.Name, counts.Where(x => x.CategoryId == c.Id).ToList()))
            .OrderByDescending(c => c.Total)
            .ToList();

        var known = allCategories.Select(c => c.Id).ToHashSet();
        var uncategorised = counts.Where(x => x.CategoryId is null || !known.Contains(x.CategoryId)).ToList();
        if (uncategorised.Count > 0)
            byCategory.Add(ToCategory(null, UncategorisedName, uncategorised));

        var byWeek = weeks
            .GroupBy(w => w.WeekStart)
            .OrderBy(g => g.Key)
            .Select(g => new WeekTrendResponse(g.Key, g.Sum(x => x.Count), g.ToDictionary(x => x.Type, x => x.Count)))
            .ToList();

        return new TrendsResponse(
            window.From,
            window.To,
            counts.Sum(x => x.Count),
            allCategories.Count,
            byCategory.Count(c => c.CategoryId is not null && c.Total > 0),
            uncategorised.Sum(x => x.Count),
            byCategory,
            byWeek,
            roles.OrderByDescending(r => r.Count).Select(r => new RoleTrendResponse(r.Role, r.Count)).ToList(),
            unmatched.Select(u => new UnmatchedQueryResponse(u.Text, u.Count, u.LastAskedAt)).ToList(),
            new ResponseTimeResponse(
                responseTime.AverageHours, responseTime.MedianHours, responseTime.AnsweredCount, responseTime.WaitingCount,
                responseTime.OldestWaitingSince, responseTime.UnseenCount));
    }

    public async Task<AdminOverviewResponse> GetOverviewAsync(CancellationToken cancellationToken)
    {
        var responseTime = await submissions.GetResponseTimeAsync(null, null, cancellationToken);
        var newFeedback = await trends.CountNewFeedbackAsync(cancellationToken);
        return new AdminOverviewResponse(
            responseTime.UnseenCount,
            responseTime.WaitingCount,
            responseTime.AverageHours,
            responseTime.MedianHours,
            responseTime.OldestWaitingSince,
            newFeedback);
    }

    private static CategoryTrendResponse ToCategory(string? id, string name, IReadOnlyList<CategoryTypeCount> rows) =>
        new(
            id,
            name,
            rows.Sum(x => x.Count),
            rows.GroupBy(x => x.Type).ToDictionary(g => g.Key, g => g.Sum(x => x.Count)),
            rows.GroupBy(x => x.Status).ToDictionary(g => g.Key, g => g.Sum(x => x.Count)));
}
