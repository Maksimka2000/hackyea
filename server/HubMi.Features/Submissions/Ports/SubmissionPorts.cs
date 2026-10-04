using HubMi.Domain.Submissions;

namespace HubMi.Features.Submissions.Ports;

public interface ISubmissionStore
{
    /// <summary>The next value of the submission number sequence (never reused, may have gaps).</summary>
    Task<long> NextNumberAsync(CancellationToken cancellationToken);

    void Add(Submission submission);

    /// <summary>Tracked, with messages, status history and links loaded.</summary>
    Task<Submission?> FindForUpdateAsync(Guid id, CancellationToken cancellationToken);
}

public sealed record SubmissionRow(
    Guid Id,
    string Number,
    SubmissionType Type,
    string Title,
    SubmissionStatus Status,
    string? CategoryId,
    Guid AuthorId,
    string AuthorRole,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    DateTime? SeenByAdminAt,
    DateTime? FirstResponseAt,
    int MessageCount);

public sealed record SubmissionFilter(
    SubmissionStatus? Status,
    SubmissionType? Type,
    string? CategoryId,
    bool UnseenOnly,
    string? Query,
    int Page,
    int PageSize);

public sealed record LinkedInnovation(Guid Id, string Title, string CategoryId);

public sealed record ResponseTimeStats(
    double? AverageHours,
    double? MedianHours,
    int AnsweredCount,
    int WaitingCount,
    DateTime? OldestWaitingSince,
    int UnseenCount);

public interface ISubmissionQueries
{
    /// <summary>Untracked, with messages, status history and links loaded.</summary>
    Task<Submission?> GetAsync(Guid id, CancellationToken cancellationToken);

    Task<IReadOnlyList<SubmissionRow>> GetByAuthorAsync(Guid authorId, CancellationToken cancellationToken);

    Task<(IReadOnlyList<SubmissionRow> Rows, int Total)> SearchAsync(SubmissionFilter filter, CancellationToken cancellationToken);

    /// <summary>Titles of library cards, published or not (staff link drafts too); unknown ids are left out.</summary>
    Task<IReadOnlyList<LinkedInnovation>> GetInnovationsAsync(IReadOnlyCollection<Guid> ids, CancellationToken cancellationToken);

    /// <summary>
    /// Time from submission to the first staff reply, over submissions created in the window (all when null).
    /// Waiting = not answered yet and not finished.
    /// </summary>
    Task<ResponseTimeStats> GetResponseTimeAsync(DateTime? from, DateTime? to, CancellationToken cancellationToken);
}
