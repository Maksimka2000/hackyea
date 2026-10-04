using HubMi.Domain.Submissions;
using HubMi.Features.Submissions.Contracts;

namespace HubMi.Features.Admin.Contracts;

/// <summary>One library category with what was submitted in it. Categories with nothing submitted are included with zeros.</summary>
public sealed record CategoryTrendResponse(
    string? CategoryId,
    string Name,
    int Total,
    IReadOnlyDictionary<SubmissionType, int> ByType,
    IReadOnlyDictionary<SubmissionStatus, int> ByStatus);

public sealed record WeekTrendResponse(DateOnly WeekStart, int Total, IReadOnlyDictionary<SubmissionType, int> ByType);

public sealed record RoleTrendResponse(string Role, int Count);

public sealed record UnmatchedQueryResponse(string Text, int Count, DateTime LastAskedAt);

/// <summary>
/// The trend dashboard. <see cref="CategoriesTotal"/> is how many categories exist, <see cref="CategoriesWithSubmissions"/> how many
/// received at least one submission in the window. <see cref="Uncategorised"/> counts submissions with no category.
/// </summary>
public sealed record TrendsResponse(
    DateTime? From,
    DateTime? To,
    int SubmissionsTotal,
    int CategoriesTotal,
    int CategoriesWithSubmissions,
    int Uncategorised,
    IReadOnlyList<CategoryTrendResponse> ByCategory,
    IReadOnlyList<WeekTrendResponse> ByWeek,
    IReadOnlyList<RoleTrendResponse> BySubmitterRole,
    IReadOnlyList<UnmatchedQueryResponse> TopUnmatchedQueries,
    ResponseTimeResponse ResponseTime);

/// <summary>The figures on the staff panel's start page.</summary>
public sealed record AdminOverviewResponse(
    int UnseenSubmissions,
    int WaitingForReply,
    double? AverageResponseHours,
    double? MedianResponseHours,
    DateTime? OldestWaitingSince,
    int NewFeedback);
