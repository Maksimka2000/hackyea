using HubMi.Domain.Accounts;

namespace HubMi.Domain.Submissions;

/// <summary>
/// A need, idea, good practice or local challenge sent to ROPS by a signed-in resident, NGO or JST. It carries its own
/// conversation and status history, so the submitter always sees where it stands and staff can measure response time.
/// </summary>
public sealed class Submission
{
    public const int MaxTitleLength = 200;
    public const int MaxDescriptionLength = 4000;
    public const int MaxMessageLength = 4000;

    private readonly List<SubmissionMessage> _messages = [];
    private readonly List<SubmissionStatusChange> _statusChanges = [];
    private readonly List<SubmissionInnovationLink> _links = [];

    private Submission()
    {
    }

    public Guid Id { get; private set; }
    public string Number { get; private set; } = null!;
    public Guid AuthorId { get; private set; }
    public string AuthorRole { get; private set; } = null!;
    public SubmissionType Type { get; private set; }
    public string Title { get; private set; } = null!;
    public string Description { get; private set; } = null!;
    public string? CategoryId { get; private set; }
    public string? Place { get; private set; }
    public string? TargetGroup { get; private set; }
    public IdeaStage? Stage { get; private set; }
    public string? PilotScale { get; private set; }
    public string? Results { get; private set; }
    public Guid? CanvasId { get; private set; }
    public SubmissionStatus Status { get; private set; }
    public string? RejectionReason { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }
    public DateTime? SeenByAdminAt { get; private set; }
    public DateTime? FirstResponseAt { get; private set; }

    public IReadOnlyList<SubmissionMessage> Messages => _messages;
    public IReadOnlyList<SubmissionStatusChange> StatusChanges => _statusChanges;
    public IReadOnlyList<SubmissionInnovationLink> Links => _links;

    public bool IsFinished => Status is SubmissionStatus.Closed or SubmissionStatus.Rejected;

    public static Submission Create(
        string number,
        Guid authorId,
        string authorRole,
        SubmissionType type,
        SubmissionDetails details,
        Guid? canvasId,
        DateTime now)
    {
        if (authorId == Guid.Empty)
            throw new DomainException("Brak autora zgłoszenia.", nameof(authorId));
        if (!AccountRoles.IsSubmitter(authorRole))
            throw new DomainException("Zgłoszenia wysyłają mieszkańcy, organizacje i samorządy.");
        if (type == SubmissionType.LocalChallenge && authorRole != AccountRoles.Jst)
            throw new DomainException("Wyzwanie lokalne zgłasza jednostka samorządu terytorialnego.");

        var submission = new Submission
        {
            Id = Guid.NewGuid(),
            Number = Text.Required(number, nameof(number)),
            AuthorId = authorId,
            AuthorRole = authorRole,
            Type = type,
            CanvasId = canvasId,
            Status = SubmissionStatus.Received,
            CreatedAt = now
        };

        submission.Apply(details, now);
        submission._statusChanges.Add(SubmissionStatusChange.Create(submission.Id, null, SubmissionStatus.Received, authorId, null, now));
        return submission;
    }

    /// <summary>Staff may tidy the text (e.g. remove personal data) before it is published or forwarded.</summary>
    public void Moderate(SubmissionDetails details, DateTime now) => Apply(details, now);

    /// <summary>First time any staff member opens it: it counts as seen and moves to "in review", so the submitter sees progress.</summary>
    public void MarkSeenByAdmin(Guid staffId, DateTime now)
    {
        if (SeenByAdminAt is not null)
            return;

        SeenByAdminAt = now;
        if (Status == SubmissionStatus.Received)
            MoveTo(SubmissionStatus.InReview, staffId, null, now);
    }

    /// <summary>Returns false when nothing changed (same status).</summary>
    public bool ChangeStatus(SubmissionStatus status, Guid staffId, string? note, DateTime now)
    {
        if (status == Status)
            return false;
        if (status == SubmissionStatus.Received)
            throw new DomainException("Zgłoszenie nie może wrócić do statusu „wysłane”.");
        if (status == SubmissionStatus.Rejected)
            throw new DomainException("Odrzucenie wymaga podania powodu.");

        MoveTo(status, staffId, Text.Optional(note), now);
        return true;
    }

    public void Reject(string reason, Guid staffId, DateTime now)
    {
        RejectionReason = Text.Required(reason, nameof(reason));
        MoveTo(SubmissionStatus.Rejected, staffId, RejectionReason, now);
    }

    /// <summary>
    /// Adds to the conversation. A staff reply records the first response time and marks an open submission answered;
    /// a submitter reply to an answer reopens the review. A closed or rejected submission accepts staff messages only.
    /// </summary>
    public SubmissionMessage AddMessage(Guid authorId, string authorRole, string body, DateTime now)
    {
        var isStaff = authorRole == AccountRoles.Admin;
        if (!isStaff && authorId != AuthorId)
            throw new DomainException("Pisać tu mogą tylko autor zgłoszenia i zespół ROPS.");
        if (!isStaff && IsFinished)
            throw new DomainException("To zgłoszenie jest zamknięte.");

        var message = SubmissionMessage.Create(Id, authorId, authorRole, Limit(body, MaxMessageLength, nameof(body)), now);
        _messages.Add(message);

        if (isStaff)
        {
            FirstResponseAt ??= now;
            SeenByAdminAt ??= now;
            if (Status is SubmissionStatus.Received or SubmissionStatus.InReview)
                MoveTo(SubmissionStatus.Answered, authorId, null, now);
        }
        else if (Status == SubmissionStatus.Answered)
        {
            MoveTo(SubmissionStatus.InReview, authorId, null, now);
        }

        UpdatedAt = now;
        return message;
    }

    /// <summary>Adds links the submission does not have yet; an existing link keeps its source and score.</summary>
    public void LinkInnovations(IEnumerable<(Guid InnovationId, int? Score)> innovations, LinkSource source)
    {
        foreach (var (innovationId, score) in innovations)
        {
            if (innovationId == Guid.Empty || _links.Any(l => l.InnovationId == innovationId))
                continue;
            _links.Add(SubmissionInnovationLink.Create(Id, innovationId, score, source));
        }
    }

    /// <summary>Staff decide the final list: links not in <paramref name="innovationIds"/> are removed, new ones are added as staff links.</summary>
    public void ReplaceLinks(IReadOnlyCollection<Guid> innovationIds, DateTime now)
    {
        _links.RemoveAll(l => !innovationIds.Contains(l.InnovationId));
        LinkInnovations(innovationIds.Select(id => (id, (int?)null)), LinkSource.Admin);
        UpdatedAt = now;
    }

    private void Apply(SubmissionDetails details, DateTime now)
    {
        var targetGroup = Text.Optional(details.TargetGroup);
        var results = Text.Optional(details.Results);

        if (Type == SubmissionType.Idea && (targetGroup is null || details.Stage is null))
            throw new DomainException("Karta pomysłu wymaga grupy docelowej i etapu.");
        if (Type == SubmissionType.GoodPractice && (targetGroup is null || results is null))
            throw new DomainException("Dobra praktyka wymaga grupy docelowej i opisu rezultatów.");

        Title = Limit(details.Title, MaxTitleLength, nameof(details.Title));
        Description = Limit(details.Description, MaxDescriptionLength, nameof(details.Description));
        CategoryId = Text.Optional(details.CategoryId);
        Place = Text.Optional(details.Place);
        TargetGroup = targetGroup;
        Stage = Type is SubmissionType.Idea or SubmissionType.GoodPractice ? details.Stage : null;
        PilotScale = Type == SubmissionType.GoodPractice ? Text.Optional(details.PilotScale) : null;
        Results = Type == SubmissionType.GoodPractice ? results : null;
        UpdatedAt = now;
    }

    private void MoveTo(SubmissionStatus status, Guid by, string? note, DateTime now)
    {
        _statusChanges.Add(SubmissionStatusChange.Create(Id, Status, status, by, note, now));
        Status = status;
        UpdatedAt = now;
    }

    private static string Limit(string? value, int max, string name)
    {
        var text = Text.Required(value, name);
        if (text.Length > max)
            throw new DomainException($"Pole {name} może mieć najwyżej {max} znaków.", name);
        return text;
    }
}

/// <summary>The submitter-written part of a submission; which fields are required depends on the type.</summary>
public sealed record SubmissionDetails(
    string Title,
    string Description,
    string? CategoryId,
    string? Place,
    string? TargetGroup,
    IdeaStage? Stage,
    string? PilotScale,
    string? Results);
