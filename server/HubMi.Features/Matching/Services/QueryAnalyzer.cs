using Microsoft.Extensions.Options;

namespace HubMi.Features.Matching.Services;

/// <summary>
/// One meaningful word of the user's text: its prefix stem, further stems that are the same word in other forms
/// (full weight, e.g. <c>wozek</c> and <c>wozk</c>), the spellings the user wrote, and the synonym stems it expands to (reduced weight).
/// </summary>
public sealed record QueryTerm(
    string Stem,
    IReadOnlyList<string> Variants,
    IReadOnlyList<string> Originals,
    IReadOnlyList<string> ExpansionStems);

public sealed record AnalyzedQuery(IReadOnlyList<QueryTerm> Terms)
{
    public static AnalyzedQuery Empty { get; } = new([]);

    /// <summary>Every distinct prefix to search for: the user's own stems and their synonym stems.</summary>
    public IReadOnlyList<string> Prefixes =>
        Terms.Select(t => t.Stem)
            .Concat(Terms.SelectMany(t => t.Variants))
            .Concat(Terms.SelectMany(t => t.ExpansionStems))
            .Distinct(StringComparer.Ordinal)
            .ToList();

    public IReadOnlyList<string> Words => Terms.SelectMany(t => t.Originals).Distinct(StringComparer.Ordinal).ToList();
}

/// <summary>Turns free text into search terms: fold, drop noise words, repair irregular forms, expand synonyms, cut to prefix stems.</summary>
public sealed class QueryAnalyzer
{
    private readonly MatchingOptions _options;
    private readonly HashSet<string> _stopWords;
    private readonly Dictionary<string, string[]> _irregularForms;
    private readonly Dictionary<string, string[]> _synonymsByStem;

    public QueryAnalyzer(IOptions<MatchingOptions> options)
    {
        _options = options.Value;
        _stopWords = _options.StopWords.Select(TextNormalizer.Fold).ToHashSet(StringComparer.Ordinal);
        // "wózku": "wózek wózk" - the first stem is the primary one, the rest are the same word in other forms.
        // Different spellings can fold to the same key ("ręka"/"ręką"); the last entry wins instead of failing startup.
        _irregularForms = new Dictionary<string, string[]>(StringComparer.Ordinal);
        foreach (var (key, value) in _options.IrregularForms)
        {
            _irregularForms[TextNormalizer.Fold(key)] =
                TextNormalizer.Fold(value).Split(' ', StringSplitOptions.RemoveEmptyEntries).Select(Stem).ToArray();
        }

        _synonymsByStem = new Dictionary<string, string[]>(StringComparer.Ordinal);
        foreach (var (key, expansions) in _options.Synonyms)
        {
            var stems = expansions
                .SelectMany(e => e.Split(' ', StringSplitOptions.RemoveEmptyEntries))
                .Select(w => Stem(TextNormalizer.Fold(w)))
                .Distinct(StringComparer.Ordinal)
                .ToArray();
            _synonymsByStem[Stem(TextNormalizer.Fold(key))] = stems;
        }
    }

    public AnalyzedQuery Analyze(string text)
    {
        var byStem = new Dictionary<string, List<string>>(StringComparer.Ordinal);
        var variantsByStem = new Dictionary<string, List<string>>(StringComparer.Ordinal);
        var order = new List<string>();

        foreach (var original in TextNormalizer.UserWords(text))
        {
            var folded = TextNormalizer.Fold(original);
            if (folded.Length < _options.MinTokenLength || _stopWords.Contains(folded))
                continue;

            string stem;
            string[] variants = [];
            if (_irregularForms.TryGetValue(folded, out var forms))
            {
                stem = forms[0];
                variants = forms[1..];
            }
            else
            {
                stem = Stem(folded);
            }

            if (!byStem.TryGetValue(stem, out var originals))
            {
                byStem[stem] = originals = [];
                variantsByStem[stem] = [];
                order.Add(stem);
            }

            foreach (var variant in variants)
            {
                if (!variantsByStem[stem].Contains(variant))
                    variantsByStem[stem].Add(variant);
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

        var userStems = order.ToHashSet(StringComparer.Ordinal);
        var expansionBudget = _options.MaxExpansionTerms;
        var terms = new List<QueryTerm>(order.Count);

        foreach (var stem in order)
        {
            var expansions = new List<string>();
            if (_synonymsByStem.TryGetValue(stem, out var synonyms))
            {
                foreach (var synonym in synonyms)
                {
                    if (expansionBudget == 0)
                        break;
                    if (userStems.Contains(synonym) || expansions.Contains(synonym))
                        continue;

                    expansions.Add(synonym);
                    expansionBudget--;
                }
            }

            terms.Add(new QueryTerm(stem, variantsByStem[stem], byStem[stem], expansions));
        }

        return new AnalyzedQuery(terms);
    }

    private string Stem(string foldedWord) =>
        foldedWord.Length <= _options.PrefixLength ? foldedWord : foldedWord[.._options.PrefixLength];
}
