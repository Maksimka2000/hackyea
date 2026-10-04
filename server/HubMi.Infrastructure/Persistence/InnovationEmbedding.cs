namespace HubMi.Infrastructure.Persistence;

/// <summary>
/// One meaning vector of a card, stored beside it but outside the domain model: an embedding is a search detail, not card data.
/// A card has a problem row, a solution row and any number of synthetic rows (<see cref="Ordinal"/> orders them).
/// <see cref="TextHash"/> is the hash of <see cref="Text"/>, so a changed card or sentence is recognised and re-embedded.
/// </summary>
public sealed class InnovationEmbedding
{
    public Guid InnovationId { get; set; }
    public string Kind { get; set; } = null!;
    public int Ordinal { get; set; }
    public string Model { get; set; } = null!;
    public string Text { get; set; } = null!;
    public string TextHash { get; set; } = null!;
    public float[] Vector { get; set; } = [];
    public DateTime UpdatedAt { get; set; }
}
