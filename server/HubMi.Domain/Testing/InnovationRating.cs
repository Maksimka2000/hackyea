namespace HubMi.Domain.Testing;

/// <summary>One user's 1–5 star rating of a library innovation. Rating again replaces the earlier stars.</summary>
public sealed class InnovationRating
{
    public const int MinStars = 1;
    public const int MaxStars = 5;

    private InnovationRating()
    {
    }

    public Guid InnovationId { get; private set; }
    public Guid UserId { get; private set; }
    public int Stars { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    public static InnovationRating Create(Guid innovationId, Guid userId, int stars, DateTime now)
    {
        var rating = new InnovationRating { InnovationId = innovationId, UserId = userId };
        rating.Rate(stars, now);
        return rating;
    }

    public void Rate(int stars, DateTime now)
    {
        if (stars is < MinStars or > MaxStars)
            throw new DomainException($"Ocena musi mieć od {MinStars} do {MaxStars} gwiazdek.", nameof(stars));
        Stars = stars;
        UpdatedAt = now;
    }
}
