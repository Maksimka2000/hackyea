using HubMi.Domain.Innovations;

namespace HubMi.Domain.Knowledge;

/// <summary>A Małopolska social challenge (from the Social Challenges Map or a report) that innovations should answer.</summary>
public sealed class Challenge
{
    private Challenge()
    {
    }

    public Guid Id { get; private set; }
    public string Title { get; private set; } = null!;
    public string Description { get; private set; } = null!;
    public string? CategoryId { get; private set; }
    public string? Source { get; private set; }
    public PublicationStatus Status { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    public static Challenge CreateDraft(string title, string description, string? categoryId, string? source, DateTime now)
    {
        var challenge = new Challenge { Id = Guid.NewGuid(), Status = PublicationStatus.Draft };
        challenge.Update(title, description, categoryId, source, now);
        return challenge;
    }

    public void Update(string title, string description, string? categoryId, string? source, DateTime now)
    {
        Title = Text.Required(title, nameof(title));
        Description = Text.Required(description, nameof(description));
        CategoryId = Text.Optional(categoryId);
        Source = Text.Optional(source);
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
            throw new DomainException("Zweryfikuj wyzwanie przed publikacją.");
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
