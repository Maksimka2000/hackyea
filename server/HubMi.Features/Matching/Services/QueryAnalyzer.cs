using Microsoft.Extensions.Options;

namespace HubMi.Features.Matching.Services;

/// <summary>One meaningful word of the user's text: its prefix stem and the spellings the user wrote.</summary>
public sealed record QueryTerm(string Stem, IReadOnlyList<string> Originals);

public sealed record AnalyzedQuery(IReadOnlyList<QueryTerm> Terms)
{
    public static AnalyzedQuery Empty { get; } = new([]);

    /// <summary>Every distinct prefix to search for (the keyword fallback and the explanation use these).</summary>
    public IReadOnlyList<string> Prefixes => Terms.Select(t => t.Stem).Distinct(StringComparer.Ordinal).ToList();

    public IReadOnlyList<string> Words => Terms.SelectMany(t => t.Originals).Distinct(StringComparer.Ordinal).ToList();
}

/// <summary>
/// Turns free text into the words used to explain a match: fold accents, drop noise words, cut to prefix stems.
/// Meaning is matched by the embedding model, so there are no synonym or word-form lists here.
/// </summary>
public sealed class QueryAnalyzer
{
    private readonly MatchingOptions _options;
    private readonly HashSet<string> _stopWords;

    public QueryAnalyzer(IOptions<MatchingOptions> options)
    {
        _options = options.Value;
        _stopWords = _options.StopWords.Select(TextNormalizer.Fold).ToHashSet(StringComparer.Ordinal);
    }

    public AnalyzedQuery Analyze(string text)
    {
        var byStem = new Dictionary<string, List<string>>(StringComparer.Ordinal);
        var order = new List<string>();

        foreach (var original in TextNormalizer.UserWords(text))
        {
            var folded = TextNormalizer.Fold(original);
            if (folded.Length < _options.MinTokenLength || _stopWords.Contains(folded))
                continue;

            var stem = Stem(folded);
            if (!byStem.TryGetValue(stem, out var originals))
            {
                byStem[stem] = originals = [];
                order.Add(stem);
            }

            if (!originals.Contains(original))
                originals.Add(original);
        }

        if (order.Count > _options.MaxQueryTerms)
        {
            // Keep the longest (most specific) words, but preserve the user's order.
            var kept = order.OrderByDescending(s => s.Length).Take(_options.MaxQueryTerms).ToHashSet(StringComparer.Ordinal);
            order = order.Where(kept.Contains).ToList();
        }

        return new AnalyzedQuery(order.Select(stem => new QueryTerm(stem, byStem[stem])).ToList());
    }

    private string Stem(string foldedWord) =>
        foldedWord.Length <= _options.PrefixLength ? foldedWord : foldedWord[.._options.PrefixLength];
}
