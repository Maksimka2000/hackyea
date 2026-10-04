using HubMi.Domain.Submissions;

namespace HubMi.Features.Admin.Ports;

public sealed record TrendWindow(DateTime? From, DateTime? To, SubmissionType? Type);

public sealed record CategoryTypeCount(string? CategoryId, SubmissionType Type, SubmissionStatus Status, int Count);

public sealed record WeekCount(DateOnly WeekStart, SubmissionType Type, int Count);

public sealed record RoleCount(string Role, int Count);

public sealed record UnmatchedQuery(string Text, int Count, DateTime LastAskedAt);

/// <summary>Aggregates over submitted needs and searches, for the staff-only trend dashboard. Nothing here identifies a person.</summary>
public interface ITrendQueries
{
    Task<IReadOnlyList<CategoryTypeCount>> CountByCategoryAsync(TrendWindow window, CancellationToken cancellationToken);

    /// <summary>Weeks start on Monday (UTC).</summary>
    Task<IReadOnlyList<WeekCount>> CountByWeekAsync(TrendWindow window, CancellationToken cancellationToken);

    Task<IReadOnlyList<RoleCount>> CountByRoleAsync(TrendWindow window, CancellationToken cancellationToken);

    /// <summary>Search texts that found no innovation, most frequent first (case and spacing ignored).</summary>
    Task<IReadOnlyList<UnmatchedQuery>> TopUnmatchedQueriesAsync(DateTime? from, DateTime? to, int limit, CancellationToken cancellationToken);

    Task<int> CountNewFeedbackAsync(CancellationToken cancellationToken);
}
