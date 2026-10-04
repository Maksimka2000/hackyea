using HubMi.Domain.Submissions;

namespace HubMi.Features.Submissions.Contracts;

public sealed record CategoryRef(string Id, string Name);

public sealed record SubmissionSummaryResponse(
    Guid Id,
    string Number,
    SubmissionType Type,
    string Title,
    SubmissionStatus Status,
    CategoryRef? Category,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    int MessageCount);

public sealed record StatusStepResponse(SubmissionStatus? From, SubmissionStatus To, DateTime ChangedAt, string? Note);

public sealed record MessageResponse(Guid Id, bool FromStaff, string AuthorName, string Body, DateTime CreatedAt);

public sealed record LinkedInnovationResponse(Guid Id, string Title, LinkSource Source, int? Score);

public sealed record AuthorResponse(Guid Id, string DisplayName, string Role, string? OrganizationName, string? Municipality);

/// <summary>One submission with its timeline, conversation and linked innovations. <see cref="Author"/> is filled for staff only.</summary>
public sealed record SubmissionDetailsResponse(
    Guid Id,
    string Number,
    SubmissionType Type,
    string Title,
    string Description,
    CategoryRef? Category,
    string? Place,
    string? TargetGroup,
    IdeaStage? Stage,
    string? PilotScale,
    string? Results,
    SubmissionStatus Status,
    string? RejectionReason,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    DateTime? FirstResponseAt,
    Guid? CanvasId,
    IReadOnlyList<StatusStepResponse> Timeline,
    IReadOnlyList<MessageResponse> Messages,
    IReadOnlyList<LinkedInnovationResponse> LinkedInnovations,
    AuthorResponse? Author);

public sealed record CreatedSubmissionResponse(Guid Id, string Number);

public sealed record AdminSubmissionRowResponse(
    Guid Id,
    string Number,
    SubmissionType Type,
    string Title,
    SubmissionStatus Status,
    CategoryRef? Category,
    string AuthorName,
    string AuthorRole,
    DateTime CreatedAt,
    bool Seen,
    DateTime? FirstResponseAt,
    double? ResponseHours,
    int MessageCount);

public sealed record PagedResponse<T>(IReadOnlyList<T> Items, int Total, int Page, int PageSize);

public sealed record ResponseTimeResponse(
    double? AverageHours,
    double? MedianHours,
    int AnsweredCount,
    int WaitingCount,
    DateTime? OldestWaitingSince,
    int UnseenCount);

public sealed record PublishedDraftResponse(Guid InnovationId);
