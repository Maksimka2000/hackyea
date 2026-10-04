using HubMi.Domain.Innovations;
using HubMi.Features.Common.Ports;
using HubMi.Features.Knowledge.Contracts;
using HubMi.Features.Knowledge.Ports;
using HubMi.Features.Matching.Ports;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace HubMi.Features.Knowledge.Services;

/// <summary>
/// Staff add, edit, verify and publish library cards. After every saved change the card is re-indexed, so matching
/// sees new text at once and a published card becomes findable (an unpublished one drops out through the published filter).
/// </summary>
public sealed class InnovationEditingService(
    IInnovationEditor editor,
    IKnowledgeQueries queries,
    IInnovationCategoryReader categories,
    IInnovationIndexer indexer,
    IUnitOfWork unitOfWork,
    IOptions<KnowledgeOptions> options,
    TimeProvider clock,
    ILogger<InnovationEditingService> logger)
{
    public async Task<IReadOnlyList<AdminInnovationRowResponse>> ListAsync(
        PublicationStatus? status, string? categoryId, string? query, CancellationToken cancellationToken)
    {
        var names = (await categories.GetAllAsync(cancellationToken)).ToDictionary(c => c.Id, c => c.Name);
        return (await queries.GetInnovationsAsync(status, categoryId, query, cancellationToken))
            .Select(r => new AdminInnovationRowResponse(
                r.Id, r.Title, r.CategoryId, names.GetValueOrDefault(r.CategoryId), r.Status, r.UpdatedAt, r.AverageRating, r.RatingCount))
            .ToList();
    }

    public async Task<AdminInnovationResponse?> GetAsync(Guid id, CancellationToken cancellationToken)
    {
        var card = await queries.GetInnovationAsync(id, cancellationToken);
        return card is null ? null : ToResponse(card);
    }

    public async Task<(Guid? Id, Dictionary<string, string[]> Errors)> CreateDraftAsync(InnovationInput input, CancellationToken cancellationToken)
    {
        var id = Guid.NewGuid();
        var (content, errors) = await ToContentAsync(input, id, cancellationToken);
        if (content is null)
            return (null, errors);

        editor.Add(Innovation.CreateDraft(id, content, clock.GetUtcNow().UtcDateTime));
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return (id, []);
    }

    /// <summary>Creates a draft card from already-built content (e.g. a submitted idea). The caller commits.</summary>
    public Innovation AddDraft(Guid id, InnovationContent content)
    {
        var innovation = Innovation.CreateDraft(id, content, clock.GetUtcNow().UtcDateTime);
        editor.Add(innovation);
        return innovation;
    }

    public string OwnSourceUrl(Guid id) => options.Value.OwnCardBaseUrl.TrimEnd('/') + "/" + id;

    public string DefaultLicenseUrl => options.Value.DefaultLicenseUrl;

    public async Task<EditResult> UpdateAsync(Guid id, InnovationInput input, CancellationToken cancellationToken)
    {
        var card = await editor.FindForUpdateAsync(id, cancellationToken);
        if (card is null)
            return EditResult.NotFound;

        var (content, errors) = await ToContentAsync(input, id, cancellationToken);
        if (content is null)
            return new EditResult(true, errors);

        card.Update(content, clock.GetUtcNow().UtcDateTime);
        await SaveAndReindexAsync(id, cancellationToken);
        return EditResult.Done;
    }

    public async Task<EditResult> ChangePublicationAsync(Guid id, PublicationAction action, Guid staffId, CancellationToken cancellationToken)
    {
        var card = await editor.FindForUpdateAsync(id, cancellationToken);
        if (card is null)
            return EditResult.NotFound;

        var now = clock.GetUtcNow().UtcDateTime;
        switch (action)
        {
            case PublicationAction.Verify: card.Verify(staffId, now); break;
            case PublicationAction.Publish: card.Publish(now); break;
            case PublicationAction.Unpublish: card.Unpublish(now); break;
        }

        await SaveAndReindexAsync(id, cancellationToken);
        return EditResult.Done;
    }

    /// <summary>Only unpublished cards can be deleted; a published card is unpublished first so links to it fail visibly.</summary>
    public async Task<EditResult> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var card = await editor.FindForUpdateAsync(id, cancellationToken);
        if (card is null)
            return EditResult.NotFound;
        if (card.Status == PublicationStatus.Published)
            return EditResult.Invalid("status", "Najpierw wycofaj publikację karty.");

        editor.Remove(card);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return EditResult.Done;
    }

    private async Task SaveAndReindexAsync(Guid id, CancellationToken cancellationToken)
    {
        await unitOfWork.SaveChangesAsync(cancellationToken);
        try
        {
            await indexer.ReindexAsync(id, cancellationToken);
        }
        catch (Exception exception) when (exception is not OperationCanceledException)
        {
            // The card is saved; the background refresher will pick the change up if the embedding model is busy or missing.
            logger.LogWarning(exception, "Re-indexing card {InnovationId} failed after an edit.", id);
        }
    }

    private async Task<(InnovationContent? Content, Dictionary<string, string[]> Errors)> ToContentAsync(
        InnovationInput input, Guid id, CancellationToken cancellationToken)
    {
        var errors = new Dictionary<string, string[]>();
        var categoryId = input.CategoryId?.Trim();
        if (string.IsNullOrEmpty(categoryId) || (await categories.GetAllAsync(cancellationToken)).All(c => c.Id != categoryId))
            errors["categoryId"] = ["Wybierz kategorię."];
        if (string.IsNullOrWhiteSpace(input.Title))
            errors["title"] = ["Podaj tytuł."];
        else if (input.Title.Trim().Length > 500)
            errors["title"] = ["Tytuł może mieć najwyżej 500 znaków."];

        foreach (var (field, value) in new[]
                 {
                     ("sourceUrl", input.SourceUrl), ("videoUrl", input.VideoUrl), ("materialsUrl", input.MaterialsUrl),
                     ("detailsPdfUrl", input.DetailsPdfUrl), ("licenseUrl", input.LicenseUrl)
                 })
        {
            if (!string.IsNullOrWhiteSpace(value) && !IsHttpUrl(value))
                errors[field] = ["Podaj pełny adres zaczynający się od https://."];
        }

        if (errors.Count > 0)
            return (null, errors);

        return (new InnovationContent(
            categoryId!,
            input.Title!,
            input.Tagline,
            input.Solution,
            input.Problems,
            input.TargetGroup,
            input.Beneficiaries,
            input.Evidence,
            string.IsNullOrWhiteSpace(input.SourceUrl) ? OwnSourceUrl(id) : input.SourceUrl,
            input.VideoUrl,
            input.MaterialsUrl,
            input.DetailsPdfUrl,
            string.IsNullOrWhiteSpace(input.LicenseUrl) ? DefaultLicenseUrl : input.LicenseUrl,
            input.DisseminationBadge), errors);
    }

    internal static bool IsHttpUrl(string value) =>
        Uri.TryCreate(value.Trim(), UriKind.Absolute, out var uri) && uri.Scheme is "http" or "https" && value.Length <= 2000;

    private static AdminInnovationResponse ToResponse(Innovation c) =>
        new(c.Id, c.CategoryId, c.Title, c.Tagline, c.Solution, c.Problems, c.TargetGroup, c.Beneficiaries, c.Evidence, c.SourceUrl,
            c.VideoUrl, c.MaterialsUrl, c.DetailsPdfUrl, c.LicenseUrl, c.DisseminationBadge, c.Status, c.VerifiedAt, c.UpdatedAt);
}
