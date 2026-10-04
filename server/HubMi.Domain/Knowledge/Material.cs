using HubMi.Domain.Innovations;

namespace HubMi.Domain.Knowledge;

public enum MaterialType
{
    Article,
    Video,
    Guide
}

/// <summary>An educational material in the knowledge store: an article, a video or a guide. It links out or carries its own text.</summary>
public sealed class Material
{
    private Material()
    {
    }

    public Guid Id { get; private set; }
    public string Title { get; private set; } = null!;
    public string Summary { get; private set; } = null!;
    public MaterialType Type { get; private set; }
    public string? Url { get; private set; }
    public string? Body { get; private set; }
    public PublicationStatus Status { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    public static Material CreateDraft(string title, string summary, MaterialType type, string? url, string? body, DateTime now)
    {
        var material = new Material { Id = Guid.NewGuid(), Status = PublicationStatus.Draft };
        material.Update(title, summary, type, url, body, now);
        return material;
    }

    public void Update(string title, string summary, MaterialType type, string? url, string? body, DateTime now)
    {
        var cleanUrl = Text.Optional(url);
        var cleanBody = Text.Optional(body);
        if (cleanUrl is null && cleanBody is null)
            throw new DomainException("Materiał wymaga linku albo własnej treści.");

        Title = Text.Required(title, nameof(title));
        Summary = Text.Required(summary, nameof(summary));
        Type = type;
        Url = cleanUrl;
        Body = cleanBody;
        if (Status == PublicationStatus.Verified)
            Status = PublicationStatus.Draft;
        UpdatedAt = now;
    }

    public void Verify(DateTime now)
    {
        if (Status == PublicationStatus.Draft)
            Status = PublicationStatus.Verified;
        UpdatedAt = now;
    }

    public void Publish(DateTime now)
    {
        if (Status != PublicationStatus.Verified)
            throw new DomainException("Zweryfikuj materiał przed publikacją.");
        Status = PublicationStatus.Published;
        UpdatedAt = now;
    }

    public void Unpublish(DateTime now)
    {
        if (Status == PublicationStatus.Published)
            Status = PublicationStatus.Verified;
        UpdatedAt = now;
    }
}
