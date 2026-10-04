namespace HubMi.Domain.Submissions;

/// <summary>One message in the conversation between the submitter and ROPS staff.</summary>
public sealed class SubmissionMessage
{
    private SubmissionMessage()
    {
    }

    public Guid Id { get; private set; }
    public Guid SubmissionId { get; private set; }
    public Guid AuthorId { get; private set; }
    public string AuthorRole { get; private set; } = null!;
    public string Body { get; private set; } = null!;
    public DateTime CreatedAt { get; private set; }

    internal static SubmissionMessage Create(Guid submissionId, Guid authorId, string authorRole, string body, DateTime now) =>
        new()
        {
            Id = Guid.NewGuid(),
            SubmissionId = submissionId,
            AuthorId = authorId,
            AuthorRole = authorRole,
            Body = body,
            CreatedAt = now
        };
}

/// <summary>One step of the status timeline. The first row has no <see cref="From"/>: the submission was received.</summary>
public sealed class SubmissionStatusChange
{
    private SubmissionStatusChange()
    {
    }

    public Guid Id { get; private set; }
    public Guid SubmissionId { get; private set; }
    public SubmissionStatus? From { get; private set; }
    public SubmissionStatus To { get; private set; }
    public Guid ChangedBy { get; private set; }
    public string? Note { get; private set; }
    public DateTime ChangedAt { get; private set; }

    internal static SubmissionStatusChange Create(
        Guid submissionId, SubmissionStatus? from, SubmissionStatus to, Guid changedBy, string? note, DateTime now) =>
        new()
        {
            Id = Guid.NewGuid(),
            SubmissionId = submissionId,
            From = from,
            To = to,
            ChangedBy = changedBy,
            Note = note,
            ChangedAt = now
        };
}

/// <summary>A library innovation related to the submission. <see cref="Score"/> is the match percent when the matcher proposed it.</summary>
public sealed class SubmissionInnovationLink
{
    private SubmissionInnovationLink()
    {
    }

    public Guid SubmissionId { get; private set; }
    public Guid InnovationId { get; private set; }
    public int? Score { get; private set; }
    public LinkSource Source { get; private set; }

    internal static SubmissionInnovationLink Create(Guid submissionId, Guid innovationId, int? score, LinkSource source) =>
        new() { SubmissionId = submissionId, InnovationId = innovationId, Score = score, Source = source };
}
