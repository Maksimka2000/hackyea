namespace HubMi.Features.Matching.Ports;

/// <summary>
/// Cross-encoder that reads the user's text together with a card and says how well they fit. Slower than vector search,
/// so it only sees the few candidates the vector search proposes. Runs locally.
/// </summary>
public interface IReranker
{
    /// <summary>False when the model could not be loaded; matching then uses the vector similarity alone, with a stricter floor.</summary>
    bool IsReady { get; }

    /// <summary>One score from 0 (unrelated) to 1 (answers the problem) per passage, in the same order.</summary>
    Task<IReadOnlyList<double>> ScoreAsync(string query, IReadOnlyList<string> passages, CancellationToken cancellationToken);
}
