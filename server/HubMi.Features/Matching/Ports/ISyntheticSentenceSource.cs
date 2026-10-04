namespace HubMi.Features.Matching.Ports;

/// <summary>
/// Reviewed sentences, in everyday words, that a person describing the problem might write (doc2query). They are only embedded
/// for retrieval and never shown to users as card content.
/// </summary>
public interface ISyntheticSentenceSource
{
    /// <summary>The reviewed sentences for the card with this source URL; empty when there are none.</summary>
    IReadOnlyList<string> For(string sourceUrl);
}
