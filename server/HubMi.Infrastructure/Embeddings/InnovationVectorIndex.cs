using HubMi.Features.Matching.Ports;

namespace HubMi.Infrastructure.Embeddings;

/// <summary>
/// All rows of the published cards in one flat array. A search is a dot product per row (vectors are normalized, so it is the cosine
/// similarity), keeping the best row of each card: microseconds at library size. The snapshot is replaced as a whole, so readers
/// never see a half-updated index.
/// </summary>
internal sealed class InnovationVectorIndex : IInnovationVectorIndex
{
    private sealed record Snapshot(Guid[] Ids, string[] Kinds, float[] Matrix, int Dimensions, string Version);

    private volatile Snapshot _snapshot = new([], [], [], 0, "empty");
    private long _generation;

    public bool IsReady => _snapshot.Ids.Length > 0;

    public string Version => _snapshot.Version;

    public void Replace(IReadOnlyList<(Guid Id, string Kind, float[] Vector)> items)
    {
        var version = $"{Interlocked.Increment(ref _generation)}";
        if (items.Count == 0)
        {
            _snapshot = new Snapshot([], [], [], 0, version);
            return;
        }

        var dimensions = items[0].Vector.Length;
        var usable = items.Where(i => i.Vector.Length == dimensions).ToList();
        var matrix = new float[usable.Count * dimensions];
        for (var row = 0; row < usable.Count; row++)
            usable[row].Vector.CopyTo(matrix, row * dimensions);

        _snapshot = new Snapshot(
            usable.Select(i => i.Id).ToArray(), usable.Select(i => i.Kind).ToArray(), matrix, dimensions, version);
    }

    public IReadOnlyList<VectorHit> Search(float[] query, int limit)
    {
        var snapshot = _snapshot;
        if (snapshot.Ids.Length == 0 || query.Length != snapshot.Dimensions)
            return [];

        var best = new Dictionary<Guid, VectorHit>();
        for (var row = 0; row < snapshot.Ids.Length; row++)
        {
            double dot = 0;
            var offset = row * snapshot.Dimensions;
            for (var i = 0; i < snapshot.Dimensions; i++)
                dot += query[i] * snapshot.Matrix[offset + i];

            if (!best.TryGetValue(snapshot.Ids[row], out var current) || dot > current.Similarity)
                best[snapshot.Ids[row]] = new VectorHit(snapshot.Ids[row], dot, snapshot.Kinds[row]);
        }

        return best.Values.OrderByDescending(h => h.Similarity).ThenBy(h => h.InnovationId).Take(limit).ToList();
    }
}
