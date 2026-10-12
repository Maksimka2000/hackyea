namespace HubMi.Features.Matching.Ports;

/// <summary>A card's best-matching row: <paramref name="Kind"/> is problem or solution.</summary>
public sealed record VectorHit(Guid InnovationId, double Similarity, string Kind);

/// <summary>Nearest-neighbour search over the rows of the published cards (cosine similarity, 1 is the same meaning).</summary>
public interface IInnovationVectorIndex
{
    /// <summary>
    /// Changes whenever a row or a published card changes; keys cached answers. Null while no vector of the current model is stored,
    /// so the caller falls back to keyword search.
    /// </summary>
    Task<string?> GetVersionAsync(CancellationToken cancellationToken);

    /// <summary>The <paramref name="limit"/> cards whose best row is most similar to the query, best first.</summary>
    Task<IReadOnlyList<VectorHit>> SearchAsync(float[] query, int limit, CancellationToken cancellationToken);
}
