namespace HubMi.Features.Matching.Ports;

/// <summary>
/// Turns text into a normalized meaning vector. Queries and card passages are embedded the same way (BGE-M3 needs no prefixes).
/// Implementations run locally; no text leaves the server.
/// </summary>
public interface ITextEmbedder
{
    /// <summary>False when the model could not be loaded; matching then falls back to keyword search.</summary>
    bool IsReady { get; }

    /// <summary>Identifies the model and its pooling so stored vectors from another model are never mixed in.</summary>
    string ModelId { get; }

    Task<float[]> EmbedAsync(string text, CancellationToken cancellationToken);
}
