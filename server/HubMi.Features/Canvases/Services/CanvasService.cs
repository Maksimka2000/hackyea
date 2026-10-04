using System.Text;
using System.Text.Json;
using HubMi.Domain.Canvases;
using HubMi.Domain.Submissions;
using HubMi.Features.Accounts;
using HubMi.Features.Canvases.Contracts;
using HubMi.Features.Canvases.Ports;
using HubMi.Features.Common.Ports;
using HubMi.Features.Submissions.Services;
using HubMi.Features.Submissions.Validators;

namespace HubMi.Features.Canvases.Services;

public sealed record CanvasResult(bool Found, Dictionary<string, string[]> Errors, CanvasResponse? Canvas = null)
{
    public static readonly CanvasResult NotFound = new(false, []);

    public static CanvasResult Invalid(string field, string message) => new(true, new() { [field] = [message] });
}

/// <summary>
/// Social Innovation Canvases: a signed-in user prototypes an idea on the boards of a template (the ROPS call form),
/// sees non-blocking checks, and finally sends the canvas to ROPS as an idea submission.
/// </summary>
public sealed class CanvasService(
    ICanvasTemplateSource templates,
    ICanvasStore store,
    ICanvasQueries queries,
    CanvasContentChecker checker,
    SubmissionService submissions,
    IUnitOfWork unitOfWork,
    TimeProvider clock)
{
    // Board keys of the ROPS template that feed the idea submission.
    private const string TitleBoard = "title";
    private const string RecipientsBoard = "recipients";
    private static readonly string[] DescriptionBoards = ["description", "problem", "change"];

    public async Task<IReadOnlyList<CanvasTemplateResponse>> GetTemplatesAsync(CancellationToken cancellationToken)
    {
        var now = Now;
        return (await templates.GetAllAsync(cancellationToken))
            .Where(t => (t.AvailableFrom is null || t.AvailableFrom <= now) && (t.AvailableTo is null || t.AvailableTo >= now))
            .Select(t => new CanvasTemplateResponse(t.Key, t.Title, t.Description, t.Source, t.Boards))
            .ToList();
    }

    public async Task<IReadOnlyList<CanvasSummaryResponse>> GetMineAsync(CurrentUser user, CancellationToken cancellationToken) =>
        (await queries.GetByOwnerAsync(user.Id, cancellationToken))
        .Select(c => new CanvasSummaryResponse(c.Id, c.TemplateKey, c.Title, c.SubmissionId is not null, c.UpdatedAt))
        .ToList();

    public async Task<CanvasResult> GetAsync(CurrentUser user, Guid id, CancellationToken cancellationToken)
    {
        var canvas = await queries.GetAsync(id, cancellationToken);
        if (canvas is null || canvas.OwnerId != user.Id)
            return CanvasResult.NotFound;
        return new CanvasResult(true, [], await ToResponseAsync(canvas, cancellationToken));
    }

    public async Task<CanvasResult> CreateAsync(CurrentUser user, CreateCanvasRequest request, CancellationToken cancellationToken)
    {
        var template = await FindTemplateAsync(request.TemplateKey, cancellationToken);
        if (template is null)
            return CanvasResult.Invalid("templateKey", "Wybierz szablon kanwy.");
        var title = string.IsNullOrWhiteSpace(request.Title) ? template.Title : request.Title.Trim();
        if (title.Length > InnovationCanvas.MaxTitleLength)
            return CanvasResult.Invalid("title", $"Najwyżej {InnovationCanvas.MaxTitleLength} znaków.");

        var canvas = InnovationCanvas.Create(user.Id, template.Key, title, Now);
        store.Add(canvas);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return new CanvasResult(true, [], await ToResponseAsync(canvas, cancellationToken));
    }

    public async Task<CanvasResult> UpdateAsync(CurrentUser user, Guid id, UpdateCanvasRequest request, CancellationToken cancellationToken)
    {
        var canvas = await store.FindForUpdateAsync(id, cancellationToken);
        if (canvas is null || canvas.OwnerId != user.Id)
            return CanvasResult.NotFound;
        var template = await FindTemplateAsync(canvas.TemplateKey, cancellationToken);
        if (template is null)
            return CanvasResult.Invalid("templateKey", "Szablon tej kanwy nie jest już dostępny.");

        if (request.Title is not null)
        {
            if (string.IsNullOrWhiteSpace(request.Title) || request.Title.Trim().Length > InnovationCanvas.MaxTitleLength)
                return CanvasResult.Invalid("title", $"Podaj tytuł (najwyżej {InnovationCanvas.MaxTitleLength} znaków).");
            canvas.Rename(request.Title, Now);
        }

        if (request.Content is { } content)
        {
            var errors = checker.Validate(template, content);
            if (errors.Count > 0)
                return new CanvasResult(true, errors);

            var json = content.GetRawText();
            if (json.Length > InnovationCanvas.MaxContentLength)
                return CanvasResult.Invalid("content", "Kanwa jest zbyt obszerna.");
            canvas.ReplaceContent(json, Now);
        }

        await unitOfWork.SaveChangesAsync(cancellationToken);
        return new CanvasResult(true, [], ToResponse(canvas, template));
    }

    public async Task<bool> DeleteAsync(CurrentUser user, Guid id, CancellationToken cancellationToken)
    {
        var canvas = await store.FindForUpdateAsync(id, cancellationToken);
        if (canvas is null || canvas.OwnerId != user.Id)
            return false;

        store.Remove(canvas);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }

    /// <summary>Sends the canvas to ROPS as an idea (title, a description built from the key boards, the target group).</summary>
    public async Task<(Guid? SubmissionId, string? Number, CanvasResult Result)> SubmitAsync(
        CurrentUser user, Guid id, CancellationToken cancellationToken)
    {
        var canvas = await store.FindForUpdateAsync(id, cancellationToken);
        if (canvas is null || canvas.OwnerId != user.Id)
            return (null, null, CanvasResult.NotFound);
        if (canvas.SubmissionId is not null)
            return (null, null, CanvasResult.Invalid("canvas", "Ta kanwa została już wysłana."));

        var template = await FindTemplateAsync(canvas.TemplateKey, cancellationToken);
        using var document = JsonDocument.Parse(canvas.ContentJson);
        var content = document.RootElement;

        var description = BuildDescription(template, content);
        var recipients = CanvasContentChecker.TextOf(content, RecipientsBoard);
        if (description.Length < 10)
            return (null, null, CanvasResult.Invalid("description", "Uzupełnij opis innowacji, zanim wyślesz kanwę."));
        if (recipients is null)
            return (null, null, CanvasResult.Invalid(RecipientsBoard, "Uzupełnij tablicę „Opis odbiorców”, zanim wyślesz kanwę."));

        var title = CanvasContentChecker.TextOf(content, TitleBoard) ?? canvas.Title;
        var details = new SubmissionDetails(
            Cut(title, Submission.MaxTitleLength),
            Cut(description, Submission.MaxDescriptionLength),
            CategoryId: null,
            Place: null,
            TargetGroup: Cut(recipients, SubmissionValidator.MaxShortFieldLength),
            Stage: IdeaStage.Idea,
            PilotScale: null,
            Results: null);

        var created = await submissions.CreateAsync(
            user, new ValidatedSubmission(SubmissionType.Idea, details, []), canvas.Id, cancellationToken);
        if (created.Created is null)
            return (null, null, new CanvasResult(true, created.Errors));

        canvas.MarkSubmitted(created.Created.Id, Now);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return (created.Created.Id, created.Created.Number, new CanvasResult(true, []));
    }

    private DateTime Now => clock.GetUtcNow().UtcDateTime;

    private async Task<CanvasTemplate?> FindTemplateAsync(string? key, CancellationToken cancellationToken) =>
        string.IsNullOrWhiteSpace(key)
            ? null
            : (await templates.GetAllAsync(cancellationToken)).FirstOrDefault(t => t.Key == key.Trim());

    private async Task<CanvasResponse> ToResponseAsync(InnovationCanvas canvas, CancellationToken cancellationToken) =>
        ToResponse(canvas, await FindTemplateAsync(canvas.TemplateKey, cancellationToken));

    private CanvasResponse ToResponse(InnovationCanvas canvas, CanvasTemplate? template)
    {
        using var document = JsonDocument.Parse(canvas.ContentJson);
        var content = document.RootElement.Clone();
        var warnings = template is null ? [] : checker.Warn(template, content);
        return new CanvasResponse(canvas.Id, canvas.TemplateKey, canvas.Title, content, canvas.SubmissionId, canvas.UpdatedAt, warnings);
    }

    private static string BuildDescription(CanvasTemplate? template, JsonElement content)
    {
        var text = new StringBuilder();
        foreach (var key in DescriptionBoards)
        {
            if (CanvasContentChecker.TextOf(content, key) is not { } answer)
                continue;
            var heading = template?.Boards.FirstOrDefault(b => b.Key == key)?.Title;
            if (text.Length > 0)
                text.Append("\n\n");
            if (heading is not null)
                text.Append(heading).Append(":\n");
            text.Append(answer);
        }

        return text.ToString();
    }

    private static string Cut(string value, int max) => value.Length <= max ? value : value[..(max - 1)] + "…";
}
