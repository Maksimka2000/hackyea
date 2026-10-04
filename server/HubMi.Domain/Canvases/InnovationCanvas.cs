namespace HubMi.Domain.Canvases;

/// <summary>
/// A user's digital Social Innovation Canvas: answers to the boards of one template, stored as a JSON object keyed by board.
/// The domain treats the content as opaque; the canvas feature knows the template and checks it.
/// </summary>
public sealed class InnovationCanvas
{
    public const int MaxTitleLength = 200;
    public const int MaxContentLength = 100_000;

    private InnovationCanvas()
    {
    }

    public Guid Id { get; private set; }
    public Guid OwnerId { get; private set; }
    public string TemplateKey { get; private set; } = null!;
    public string Title { get; private set; } = null!;
    public string ContentJson { get; private set; } = null!;
    public Guid? SubmissionId { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    public static InnovationCanvas Create(Guid ownerId, string templateKey, string title, DateTime now)
    {
        if (ownerId == Guid.Empty)
            throw new DomainException("Brak właściciela kanwy.", nameof(ownerId));

        var canvas = new InnovationCanvas
        {
            Id = Guid.NewGuid(),
            OwnerId = ownerId,
            TemplateKey = Text.Required(templateKey, nameof(templateKey)),
            ContentJson = "{}",
            CreatedAt = now
        };
        canvas.Rename(title, now);
        return canvas;
    }

    public void Rename(string title, DateTime now)
    {
        var text = Text.Required(title, nameof(title));
        if (text.Length > MaxTitleLength)
            throw new DomainException($"Tytuł może mieć najwyżej {MaxTitleLength} znaków.", nameof(title));
        Title = text;
        UpdatedAt = now;
    }

    public void ReplaceContent(string contentJson, DateTime now)
    {
        if (string.IsNullOrWhiteSpace(contentJson))
            throw new DomainException("Brak treści kanwy.", nameof(contentJson));
        if (contentJson.Length > MaxContentLength)
            throw new DomainException("Kanwa jest zbyt obszerna.", nameof(contentJson));
        ContentJson = contentJson;
        UpdatedAt = now;
    }

    /// <summary>A canvas is sent to ROPS once, as an idea submission; editing afterwards does not change what was sent.</summary>
    public void MarkSubmitted(Guid submissionId, DateTime now)
    {
        if (SubmissionId is not null)
            throw new DomainException("Ta kanwa została już wysłana.");
        SubmissionId = submissionId;
        UpdatedAt = now;
    }
}
