using System.Text.RegularExpressions;

namespace HubMi.Features.Matching.Services;

/// <summary>
/// Accent folding shared by the query side and the card side. The database folds with the same letter map
/// (<c>hubmi_fold</c> in the initial migration), so a prefix built here matches words indexed there.
/// </summary>
public static partial class TextNormalizer
{
    private const string Accented = "ąćęłńóśźż";
    private const string Plain = "acelnoszz";

    [GeneratedRegex(@"\p{L}+")]
    private static partial Regex LetterWords();

    [GeneratedRegex(@"[\p{L}\p{Nd}]+")]
    private static partial Regex LetterOrDigitWords();

    public static string Fold(string text)
    {
        var lower = text.ToLowerInvariant();
        return string.Create(lower.Length, lower, static (span, source) =>
        {
            for (var i = 0; i < source.Length; i++)
            {
                var index = Accented.IndexOf(source[i]);
                span[i] = index >= 0 ? Plain[index] : source[i];
            }
        });
    }

    /// <summary>Lower-case letter words exactly as the user wrote them (accents kept, digits dropped).</summary>
    public static IEnumerable<string> UserWords(string text) =>
        LetterWords().Matches(text).Select(m => m.Value.ToLowerInvariant());

    /// <summary>Folded words of a card field, as the database tokenizes them.</summary>
    public static string[] IndexWords(string? text) =>
        string.IsNullOrWhiteSpace(text)
            ? []
            : LetterOrDigitWords().Matches(Fold(text)).Select(m => m.Value).ToArray();
}
