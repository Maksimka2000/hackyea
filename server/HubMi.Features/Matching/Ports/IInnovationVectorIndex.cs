namespace HubMi.Features.Matching.Ports;

/// <summary>A card's best-matching row: <paramref name="Kind"/> is problem, solution or synthetic.</summary>
public sealed record VectorHit(Guid InnovationId, double Similarity, string Kind);

/// <summary>In-memory nearest-neighbour search over the rows of the published cards (cosine similarity of normalized vectors).</summary>
public interface IInnovationVectorIndex
{
    /// <summary>False until at least one vector is loaded.</summary>
    bool IsReady { get; }

    /// <summary>Changes whenever the index content is replaced; keys cached answers.</summary>
    string Version { get; }

    /// <summary>The <paramref name="limit"/> cards whose best row is most similar to the query, best first.</summary>
    IReadOnlyList<VectorHit> Search(float[] query, int limit);
}
