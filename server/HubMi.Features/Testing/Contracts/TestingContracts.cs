using HubMi.Domain.Testing;

namespace HubMi.Features.Testing.Contracts;

public sealed class RateRequest
{
    public int Stars { get; init; }
}

/// <summary><c>kind</c>: feedback (an opinion) or improvement (a proposal to improve the solution).</summary>
public sealed class FeedbackRequest
{
    public string? Kind { get; init; }
    public string? Body { get; init; }
}

/// <summary><c>status</c>: accepted or rejected.</summary>
public sealed class ReviewFeedbackRequest
{
    public string? Status { get; init; }
    public string? StaffNote { get; init; }
}

/// <summary><see cref="MyStars"/> is the caller's own rating when signed in.</summary>
public sealed record RatingSummaryResponse(Guid InnovationId, double? Average, int Count, IReadOnlyList<int> Distribution, int? MyStars);

public sealed record FeedbackResponse(
    Guid Id,
    Guid InnovationId,
    string InnovationTitle,
    FeedbackKind Kind,
    string Body,
    FeedbackStatus Status,
    string? StaffNote,
    DateTime CreatedAt,
    DateTime? ReviewedAt,
    string? AuthorName);

public sealed record RatedInnovationResponse(Guid InnovationId, string Title, double Average, int RatingCount, int NewFeedbackCount);
