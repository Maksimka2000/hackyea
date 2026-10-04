using HubMi.Domain.Submissions;
using HubMi.Features.Submissions.Contracts;

namespace HubMi.Features.Submissions.Validators;

public sealed record ValidatedSubmission(SubmissionType Type, SubmissionDetails Details, IReadOnlyList<Guid> SeenInnovationIds);

/// <summary>Checks the HTTP input and turns it into domain values. Errors are keyed by field, in Polish, for the form.</summary>
public sealed class SubmissionValidator
{
    public const int MaxShortFieldLength = 300;
    public const int MaxSeenInnovations = 10;

    public bool TryValidateCreate(
        CreateSubmissionRequest? request, out ValidatedSubmission? validated, out Dictionary<string, string[]> errors)
    {
        validated = null;
        errors = [];

        if (!TryParse<SubmissionType>(request?.Type, out var type))
            errors["type"] = ["Wybierz rodzaj zgłoszenia."];

        var details = ValidateDetails(
            type,
            request?.Title,
            request?.Description,
            request?.CategoryId,
            request?.Place,
            request?.TargetGroup,
            request?.Stage,
            request?.PilotScale,
            request?.Results,
            errors);

        var seen = request?.SeenInnovationIds?.Where(id => id != Guid.Empty).Distinct().ToList() ?? [];
        if (seen.Count > MaxSeenInnovations)
            errors["seenInnovationIds"] = [$"Najwyżej {MaxSeenInnovations} innowacji."];

        if (errors.Count > 0)
            return false;

        validated = new ValidatedSubmission(type, details, seen);
        return true;
    }

    public bool TryValidateModeration(
        SubmissionType type, ModerateSubmissionRequest? request, out SubmissionDetails? details, out Dictionary<string, string[]> errors)
    {
        errors = [];
        details = ValidateDetails(
            type,
            request?.Title,
            request?.Description,
            request?.CategoryId,
            request?.Place,
            request?.TargetGroup,
            request?.Stage,
            request?.PilotScale,
            request?.Results,
            errors);

        if (errors.Count == 0)
            return true;

        details = null;
        return false;
    }

    public static bool TryValidateMessage(AddMessageRequest? request, out string body, out Dictionary<string, string[]> errors)
    {
        errors = [];
        body = request?.Body?.Trim() ?? string.Empty;
        if (body.Length == 0)
            errors["body"] = ["Wpisz treść wiadomości."];
        else if (body.Length > Submission.MaxMessageLength)
            errors["body"] = [$"Wiadomość może mieć najwyżej {Submission.MaxMessageLength} znaków."];
        return errors.Count == 0;
    }

    public static bool TryParse<T>(string? value, out T result) where T : struct, Enum =>
        Enum.TryParse(value?.Trim(), ignoreCase: true, out result) && Enum.IsDefined(result);

    private static SubmissionDetails ValidateDetails(
        SubmissionType type,
        string? title,
        string? description,
        string? categoryId,
        string? place,
        string? targetGroup,
        string? stageText,
        string? pilotScale,
        string? results,
        Dictionary<string, string[]> errors)
    {
        var cleanDescription = description?.Trim() ?? string.Empty;
        if (cleanDescription.Length < 10)
            errors["description"] = ["Opisz sprawę w co najmniej 10 znakach."];
        else if (cleanDescription.Length > Submission.MaxDescriptionLength)
            errors["description"] = [$"Opis może mieć najwyżej {Submission.MaxDescriptionLength} znaków."];

        // A need typed into the search box often has no title: use the start of the description.
        var cleanTitle = string.IsNullOrWhiteSpace(title) ? TitleFrom(cleanDescription) : title.Trim();
        if (cleanTitle.Length > Submission.MaxTitleLength)
            errors["title"] = [$"Tytuł może mieć najwyżej {Submission.MaxTitleLength} znaków."];

        CheckShort("place", place, errors);
        CheckShort("targetGroup", targetGroup, errors);
        CheckShort("pilotScale", pilotScale, errors);
        if (results?.Trim().Length > Submission.MaxDescriptionLength)
            errors["results"] = [$"Opis rezultatów może mieć najwyżej {Submission.MaxDescriptionLength} znaków."];

        IdeaStage? stage = null;
        if (!string.IsNullOrWhiteSpace(stageText))
        {
            if (TryParse<IdeaStage>(stageText, out var parsed))
                stage = parsed;
            else
                errors["stage"] = ["Wybierz etap: pomysł, przetestowany w małej skali albo działa."];
        }

        if (type is SubmissionType.Idea or SubmissionType.GoodPractice && string.IsNullOrWhiteSpace(targetGroup))
            errors["targetGroup"] = ["Napisz, dla kogo jest to rozwiązanie."];
        if (type == SubmissionType.Idea && stage is null && !errors.ContainsKey("stage"))
            errors["stage"] = ["Wybierz etap pomysłu."];
        if (type == SubmissionType.GoodPractice && string.IsNullOrWhiteSpace(results))
            errors["results"] = ["Opisz, co udało się osiągnąć."];

        return new SubmissionDetails(cleanTitle, cleanDescription, categoryId, place, targetGroup, stage, pilotScale, results);
    }

    private static void CheckShort(string field, string? value, Dictionary<string, string[]> errors)
    {
        if (value?.Trim().Length > MaxShortFieldLength)
            errors[field] = [$"Najwyżej {MaxShortFieldLength} znaków."];
    }

    private static string TitleFrom(string description)
    {
        const int length = 80;
        if (description.Length <= length)
            return description;
        var cut = description[..length];
        var space = cut.LastIndexOf(' ');
        return (space > 40 ? cut[..space] : cut).TrimEnd(',', '.', ';', ' ') + "…";
    }
}
