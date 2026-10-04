using System.Security.Cryptography;
using System.Text;
using HubMi.Domain.Innovations;

namespace HubMi.Features.Matching.Services;

/// <summary>
/// The texts of a card that are compared with the user's words. The beneficiaries list is left out everywhere: it names the
/// institutions that can use the card, not whose problem it solves. The target group never stands alone, otherwise every card
/// for seniors would match "moja babcia ..." whatever the problem. The hash tells the indexer when a row's text changed.
/// </summary>
public static class PassageTextBuilder
{
    public const string ProblemKind = "problem";
    public const string SolutionKind = "solution";
    public const string SyntheticKind = "synthetic";

    public const int SolutionMaxLength = 600;

    /// <summary>Retrieval row "who has which problem"; empty (no row) when the card states no problem.</summary>
    public static string BuildProblem(Innovation card) =>
        string.IsNullOrWhiteSpace(card.Problems)
            ? string.Empty
            : Join(" ", Labelled("Problem", card.Problems), Labelled("Dla kogo", card.TargetGroup));

    /// <summary>Retrieval row for queries that ask for a tool or an activity.</summary>
    public static string BuildSolution(Innovation card) =>
        Join(" ", card.Title, card.Tagline, Shorten(card.Solution, SolutionMaxLength));

    /// <summary>
    /// The text the reranker reads together with the query. Problem and target group come before the solution so that
    /// they survive when the pair is cut to the model's token limit.
    /// </summary>
    public static string BuildRerank(Innovation card) =>
        Join("\n",
            Labelled("Tytuł", card.Title),
            Labelled("Problem", card.Problems),
            Labelled("Dla kogo", card.TargetGroup),
            Labelled("Rozwiązanie", Join(" ", card.Tagline, Shorten(card.Solution, SolutionMaxLength))));

    public static string Hash(string text) => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(text))).ToLowerInvariant();

    private static string? Labelled(string label, string? text) =>
        string.IsNullOrWhiteSpace(text) ? null : $"{label}: {text.Trim()}";

    private static string? Shorten(string? text, int maxLength)
    {
        if (string.IsNullOrWhiteSpace(text))
            return null;

        text = text.Trim();
        return text.Length <= maxLength ? text : text[..maxLength];
    }

    // Parts are trimmed on purpose: the model tokenizer drops a trailing space that other tokenizers keep.
    private static string Join(string separator, params string?[] parts) =>
        string.Join(separator, parts.Where(p => !string.IsNullOrWhiteSpace(p)).Select(p => p!.Trim()));
}
