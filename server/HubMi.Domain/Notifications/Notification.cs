namespace HubMi.Domain.Notifications;

public enum NotificationKind
{
    /// <summary>To staff: a new need, idea, good practice or local challenge arrived.</summary>
    SubmissionCreated,

    /// <summary>To staff: the submitter wrote in the conversation.</summary>
    SubmitterMessage,

    /// <summary>To the submitter: staff replied.</summary>
    StaffReply,

    /// <summary>To the submitter: the status changed.</summary>
    StatusChanged,

    /// <summary>To staff: someone gave feedback on or proposed an improvement to an innovation.</summary>
    FeedbackReceived,

    /// <summary>To the author: staff accepted or rejected their feedback, possibly with a note.</summary>
    FeedbackReviewed
}

/// <summary>
/// An in-app notice, fetched by polling. Either addressed to one user, or to the whole ROPS staff team
/// (<see cref="ForStaff"/>), in which case one staff member reading it marks it read for the team: it is a shared inbox.
/// </summary>
public sealed class Notification
{
    public const int MaxSummaryLength = 200;

    private Notification()
    {
    }

    public Guid Id { get; private set; }
    public Guid? RecipientUserId { get; private set; }
    public bool ForStaff { get; private set; }
    public NotificationKind Kind { get; private set; }
    public Guid? SubmissionId { get; private set; }
    public Guid? InnovationId { get; private set; }
    public string Summary { get; private set; } = null!;
    public DateTime CreatedAt { get; private set; }
    public DateTime? ReadAt { get; private set; }

    public static Notification ToUser(Guid userId, NotificationKind kind, string summary, Guid? submissionId, Guid? innovationId, DateTime now)
    {
        if (userId == Guid.Empty)
            throw new DomainException("Brak odbiorcy powiadomienia.", nameof(userId));
        return Create(userId, false, kind, summary, submissionId, innovationId, now);
    }

    public static Notification ToStaff(NotificationKind kind, string summary, Guid? submissionId, Guid? innovationId, DateTime now) =>
        Create(null, true, kind, summary, submissionId, innovationId, now);

    public void MarkRead(DateTime now) => ReadAt ??= now;

    private static Notification Create(
        Guid? userId, bool forStaff, NotificationKind kind, string summary, Guid? submissionId, Guid? innovationId, DateTime now)
    {
        var text = Text.Required(summary, nameof(summary));
        return new Notification
        {
            Id = Guid.NewGuid(),
            RecipientUserId = userId,
            ForStaff = forStaff,
            Kind = kind,
            SubmissionId = submissionId,
            InnovationId = innovationId,
            Summary = text.Length > MaxSummaryLength ? text[..(MaxSummaryLength - 1)] + "…" : text,
            CreatedAt = now
        };
    }
}
