using HubMi.Domain.Testing;

namespace HubMi.Features.Testing.Ports;

public interface IRatingStore
{
    void Add(InnovationRating rating);

    /// <summary>Tracked; null when this user has not rated the card yet.</summary>
    Task<InnovationRating?> FindForUpdateAsync(Guid innovationId, Guid userId, CancellationToken cancellationToken);
}

public interface IFeedbackStore
{
    void Add(InnovationFeedback feedback);

    Task<InnovationFeedback?> FindForUpdateAsync(Guid id, CancellationToken cancellationToken);
}

public sealed record RatingSummary(double? Average, int Count, IReadOnlyList<int> Distribution);

public sealed record FeedbackRow(
    Guid Id,
    Guid InnovationId,
    string InnovationTitle,
    Guid UserId,
    FeedbackKind Kind,
    string Body,
    FeedbackStatus Status,
    string? StaffNote,
    DateTime CreatedAt,
    DateTime? ReviewedAt);

/// <summary>One rated card for the staff overview: its star average, how many rated it, and opinions still to review.</summary>
public sealed record RatedInnovation(Guid InnovationId, string Title, double Average, int RatingCount, int NewFeedbackCount);

public interface ITestingQueries
{
    /// <summary>Every card with at least one rating, most rated first.</summary>
    Task<IReadOnlyList<RatedInnovation>> GetRatingOverviewAsync(CancellationToken cancellationToken);

    /// <summary>The card's title whether or not it is published; null when it no longer exists.</summary>
    Task<string?> GetInnovationTitleAsync(Guid innovationId, CancellationToken cancellationToken);

    /// <summary>Average, count and how many gave 1..5 stars (index 0 = one star).</summary>
    Task<RatingSummary> GetSummaryAsync(Guid innovationId, CancellationToken cancellationToken);

    Task<int?> GetStarsAsync(Guid innovationId, Guid userId, CancellationToken cancellationToken);

    Task<IReadOnlyList<FeedbackRow>> GetFeedbackByUserAsync(Guid userId, CancellationToken cancellationToken);

    Task<IReadOnlyList<FeedbackRow>> GetFeedbackAsync(FeedbackKind? kind, FeedbackStatus? status, CancellationToken cancellationToken);
}
