using System.Text.RegularExpressions;
using HubMi.Features.Matching.Contracts;

namespace HubMi.Features.Matching.Validators;

public sealed record ValidatedMatchRequest(string Text, bool Dictated);

public sealed partial class MatchRequestValidator
{
    [GeneratedRegex(@"<[^>]*>")]
    private static partial Regex Markup();

    [GeneratedRegex(@"[\p{Cc}\s]+")]
    private static partial Regex WhitespaceOrControl();

    /// <summary>Strips markup, collapses whitespace and checks length. Returns errors keyed by field when the request is invalid.</summary>
    public bool TryValidate(
        MatchRequestDto? request,
        MatchingOptions options,
        out ValidatedMatchRequest? validated,
        out Dictionary<string, string[]> errors)
    {
        validated = null;
        errors = [];

        var text = WhitespaceOrControl().Replace(Markup().Replace(request?.Text ?? string.Empty, " "), " ").Trim();
        if (text.Length < options.MinTextLength)
            errors["text"] = [$"Opisz problem w co najmniej {options.MinTextLength} znakach."];
        else if (text.Length > options.MaxTextLength)
            errors["text"] = [$"Opis może mieć najwyżej {options.MaxTextLength} znaków."];

        var mode = request?.InputMode?.Trim().ToLowerInvariant();
        if (mode is not (null or "" or "typed" or "dictated"))
            errors["inputMode"] = ["Dozwolone wartości: typed, dictated."];

        if (errors.Count > 0)
            return false;

        validated = new ValidatedMatchRequest(text, mode == "dictated");
        return true;
    }
}
