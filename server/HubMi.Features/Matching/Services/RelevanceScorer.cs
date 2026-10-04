using HubMi.Domain.Innovations;
using HubMi.Domain.Matching;
using HubMi.Features.Matching.Ports;
using Microsoft.Extensions.Options;

namespace HubMi.Features.Matching.Services;

public sealed record ScoredInnovation(
    Innovation Innovation,
    double Score,
    int Percent,
    MatchLevel Level,
    IReadOnlyList<string> MatchedWords,
    IReadOnlyList<string> MatchedFields,
    IReadOnlyList<string> MissingWords,
    string? MatchedKind = null)
{
    public bool HasMatch => MatchedWords.Count > 0;
}

/// <summary>
/// Keyword view of one card against the analyzed query: which of the user's words the card contains and in which sections.
/// Score is IDF-weighted and field-weighted with a mild length penalty; Percent is coverage, the share of the query's important
/// words the card contains. The keyword fallback ranks with these; with the meaning index they only explain the match.
/// </summary>
public sealed class RelevanceScorer(IOptions<MatchingOptions> options)
{
    private readonly MatchingOptions _options = options.Value;

    public ScoredInnovation Score(Innovation card, AnalyzedQuery query, CorpusStatistics statistics)
    {
        var fields = BuildFields(card);
        var totalTokens = fields.Sum(f => f.Tokens.Length);

        var credit = 0.0;
        var maxCredit = 0.0;
        var matchedWords = new List<string>();
        var missingWords = new List<string>();
        var matchedFields = new HashSet<string>(StringComparer.Ordinal);

        foreach (var term in query.Terms)
        {
            var idf = statistics.Idf(term.Stem);
            maxCredit += idf;

            var best = 0.0;
            foreach (var field in fields)
            {
                if (!ContainsPrefix(field.Tokens, term.Stem))
                    continue;

                best = Math.Max(best, field.Weight);
                matchedFields.Add(field.Name);
            }

            credit += idf * best;
            (best > 0 ? matchedWords : missingWords).AddRange(term.Originals);
        }

        var percent = maxCredit > 0 ? (int)Math.Round(100 * credit / maxCredit) : 0;
        var score = credit / (1 + _options.LengthNormalization * Math.Log(totalTokens + 1));
        var orderedFields = fields.Select(f => f.Name).Where(matchedFields.Contains).ToList();

        return new ScoredInnovation(card, score, percent, LevelFor(percent), matchedWords, orderedFields, missingWords);
    }

    public MatchLevel LevelFor(int percent) =>
        percent >= _options.GoodThreshold ? MatchLevel.Good
        : percent >= _options.PartialThreshold ? MatchLevel.Partial
        : MatchLevel.Weak;

    private static bool ContainsPrefix(string[] tokens, string prefix)
    {
        foreach (var token in tokens)
        {
            if (token.StartsWith(prefix, StringComparison.Ordinal))
                return true;
        }

        return false;
    }

    private List<Field> BuildFields(Innovation card) =>
    [
        new("Tytuł", _options.PrimaryFieldWeight, TextNormalizer.IndexWords(card.Title)),
        new("Opis w skrócie", _options.PrimaryFieldWeight, TextNormalizer.IndexWords(card.Tagline)),
        new("Opis problemu", _options.SecondaryFieldWeight, TextNormalizer.IndexWords(card.Problems)),
        new("Grupa docelowa", _options.SecondaryFieldWeight, TextNormalizer.IndexWords(card.TargetGroup)),
        new("Opis rozwiązania", _options.TertiaryFieldWeight, TextNormalizer.IndexWords(card.Solution))
    ];

    private sealed record Field(string Name, double Weight, string[] Tokens);
}
