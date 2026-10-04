using System.Text.RegularExpressions;
using HubMi.Domain.Innovations;
using HubMi.Features.Matching.Contracts;

namespace HubMi.Features.Matching.Services;

/// <summary>
/// Shows why a card matched using only the card's own stored text: the sentence that fits the user's words best, with the words
/// that occur in it marked. A card that matched by meaning shares no word with the user, so its excerpt has no marks and
/// <see cref="WhyDto.ByMeaning"/> says so. Nothing is generated.
/// </summary>
public static partial class MatchExplainer
{
    public const string ProblemField = "problem";
    public const string SolutionField = "solution";

    private const int ExcerptMaxLength = 220;

    [GeneratedRegex(@"[\p{L}\p{Nd}]+")]
    private static partial Regex Words();

    // A full stop after a common abbreviation (tzn., tj., np., itp.) does not end a sentence.
    [GeneratedRegex(@"(?<=[.!?;])(?<!\b(?:tzn|tj|np|itp|itd|tzw|ok|ul|im|ws|r|wg|dr|prof|min|max)\.)\s+|\n+", RegexOptions.IgnoreCase)]
    private static partial Regex SentenceBreaks();

    // Most cards open with the same boilerplate; the excerpt starts at the actual problem.
    [GeneratedRegex(@"^Innowacja\s+(?:odpowiada\s+na|stanowi\s+odpowiedź\s+na|jest\s+odpowiedzią\s+na|dotyczy|ma\s+na\s+celu)\s+", RegexOptions.IgnoreCase)]
    private static partial Regex LeadIn();

    /// <param name="matchedKind">The row that matched in the vector search (problem, solution, synthetic) or null for the keyword fallback.</param>
    /// <param name="sharesWords">Whether the user's words occur anywhere in the card.</param>
    public static WhyDto Explain(Innovation card, string? matchedKind, AnalyzedQuery query, bool sharesWords)
    {
        var problem = StripLeadIn(card.Problems?.Trim() ?? string.Empty);
        var solution = string.Join(' ', new[] { card.Tagline, card.Solution }.Where(t => !string.IsNullOrWhiteSpace(t)).Select(t => t!.Trim()));
        var stems = query.Prefixes;

        var field = matchedKind switch
        {
            "solution" => SolutionField,
            "problem" or "synthetic" => ProblemField,
            // Keyword fallback: the field that holds more of the user's words.
            _ => HitCount(problem, stems) >= HitCount(solution, stems) ? ProblemField : SolutionField
        };

        var text = field == ProblemField ? problem : solution;
        if (text.Length == 0)
        {
            field = field == ProblemField ? SolutionField : ProblemField;
            text = field == ProblemField ? problem : solution;
        }

        var excerpt = Excerpt(text, stems);
        return new WhyDto(field, excerpt, Highlights(excerpt, stems), !sharesWords);
    }

    private static string StripLeadIn(string text)
    {
        var stripped = LeadIn().Replace(text, string.Empty);
        return stripped.Length < text.Length && stripped.Length > 0 ? char.ToUpperInvariant(stripped[0]) + stripped[1..] : text;
    }

    private static string Excerpt(string text, IReadOnlyList<string> stems)
    {
        if (text.Length == 0)
            return string.Empty;

        var sentence = SentenceBreaks().Split(text)
            .Select(s => s.Trim())
            .Where(s => s.Length > 0)
            .Select((s, index) => (Sentence: s, Hits: HitCount(s, stems), index))
            .OrderByDescending(x => x.Hits)
            .ThenBy(x => x.index)
            .First().Sentence;

        if (sentence.Length <= ExcerptMaxLength)
            return sentence;

        // A long sentence: a window around the first word of the user's that occurs in it, cut at word boundaries.
        var anchor = Words().Matches(sentence).FirstOrDefault(m => MatchesAny(m.Value, stems))?.Index ?? 0;
        var start = Math.Max(0, anchor - ExcerptMaxLength / 4);
        var end = Math.Min(sentence.Length, start + ExcerptMaxLength);
        if (start > 0)
            start = NextBoundary(sentence, start);
        if (end < sentence.Length)
            end = PreviousBoundary(sentence, end, start);

        return (start > 0 ? "… " : string.Empty) + sentence[start..end].Trim() + (end < sentence.Length ? " …" : string.Empty);
    }

    private static int NextBoundary(string text, int index)
    {
        var space = text.IndexOf(' ', index);
        return space < 0 ? index : space + 1;
    }

    private static int PreviousBoundary(string text, int index, int minimum)
    {
        var space = text.LastIndexOf(' ', index - 1);
        return space > minimum ? space : index;
    }

    private static List<HighlightDto> Highlights(string excerpt, IReadOnlyList<string> stems) =>
        Words().Matches(excerpt)
            .Where(m => MatchesAny(m.Value, stems))
            .Select(m => new HighlightDto(m.Index, m.Length))
            .ToList();

    private static int HitCount(string text, IReadOnlyList<string> stems) =>
        stems.Count == 0
            ? 0
            : Words().Matches(text).Select(m => TextNormalizer.Fold(m.Value))
                .SelectMany(word => stems.Where(stem => word.StartsWith(stem, StringComparison.Ordinal)))
                .Distinct(StringComparer.Ordinal)
                .Count();

    /// <summary>Folding keeps the length of every character, so offsets in the folded word are offsets in the original text.</summary>
    private static bool MatchesAny(string word, IReadOnlyList<string> stems)
    {
        var folded = TextNormalizer.Fold(word);
        return stems.Any(stem => folded.StartsWith(stem, StringComparison.Ordinal));
    }
}
