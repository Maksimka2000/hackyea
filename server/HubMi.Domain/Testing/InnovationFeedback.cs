namespace HubMi.Domain.Testing;

public enum FeedbackKind
{
    /// <summary>An opinion or experience with the solution.</summary>
    Feedback,

    /// <summary>A concrete proposal to improve the solution.</summary>
    Improvement
}

public enum FeedbackStatus
{
    New,
    Accepted,
    Rejected
}

/// <summary>Feedback on, or an improvement proposed to, a library innovation. Staff review it and may leave a note.</summary>
public sealed class InnovationFeedback
{
    public const int MaxBodyLength = 2000;

    private InnovationFeedback()
    {
    }

    public Guid Id { get; private set; }
    public Guid InnovationId { get; private set; }
    public Guid UserId { get; private set; }
    public FeedbackKind Kind { get; private set; }
    public string Body { get; private set; } = null!;
    public FeedbackStatus Status { get; private set; }
    public string? StaffNote { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? ReviewedAt { get; private set; }

    public static InnovationFeedback Create(Guid innovationId, Guid userId, FeedbackKind kind, string body, DateTime now)
    {
        var text = Text.Required(body, nameof(body));
        if (text.Length > MaxBodyLength)
            throw new DomainException($"Opinia może mieć najwyżej {MaxBodyLength} znaków.", nameof(body));

        return new InnovationFeedback
        {
            Id = Guid.NewGuid(),
            InnovationId = innovationId,
            UserId = userId,
            Kind = kind,
            Body = text,
            Status = FeedbackStatus.New,
            CreatedAt = now
        };
    }

    public void Review(FeedbackStatus status, string? staffNote, DateTime now)
    {
        if (status == FeedbackStatus.New)
            throw new DomainException("Opinię można przyjąć albo odrzucić.");
        Status = status;
        StaffNote = Text.Optional(staffNote);
        ReviewedAt = now;
    }
}
