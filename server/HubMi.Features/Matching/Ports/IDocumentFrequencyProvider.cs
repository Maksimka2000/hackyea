namespace HubMi.Features.Matching.Ports;

/// <summary>How many published cards contain a word starting with each prefix; the basis for IDF weighting.</summary>
public interface IDocumentFrequencyProvider
{
    Task<CorpusStatistics> GetAsync(IReadOnlyCollection<string> prefixes, CancellationToken cancellationToken);
}

public sealed record CorpusStatistics(int TotalDocuments, IReadOnlyDictionary<string, int> DocumentFrequencies)
{
    public static CorpusStatistics Empty { get; } = new(0, new Dictionary<string, int>());

    /// <summary>
    /// Smoothed inverse document frequency. A prefix found in no card (typically a narrative word such as "czuję")
    /// gets the neutral weight 1.0, so it neither dominates ranking nor drags the match percentage down.
    /// </summary>
    public double Idf(string prefix)
    {
        var frequency = DocumentFrequencies.GetValueOrDefault(prefix);
        return frequency <= 0 ? 1.0 : Math.Log((TotalDocuments + 1.0) / (frequency + 1.0)) + 1.0;
    }
}
