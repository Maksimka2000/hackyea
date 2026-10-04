using HubMi.Domain.Innovations;
using HubMi.Domain.Knowledge;
using HubMi.Features.Common.Ports;
using HubMi.Features.Knowledge.Contracts;
using HubMi.Features.Knowledge.Ports;

namespace HubMi.Features.Knowledge.Services;

/// <summary>Challenges and educational materials of the knowledge store: staff edit them, the public reads the published ones.</summary>
public sealed class KnowledgeContentService(
    IChallengeStore challenges,
    IMaterialStore materials,
    IKnowledgeQueries queries,
    IUnitOfWork unitOfWork,
    TimeProvider clock)
{
    public async Task<IReadOnlyList<ChallengeResponse>> GetChallengesAsync(bool publishedOnly, CancellationToken cancellationToken) =>
        (await queries.GetChallengesAsync(publishedOnly, cancellationToken)).Select(ToResponse).ToList();

    public async Task<IReadOnlyList<MaterialResponse>> GetMaterialsAsync(bool publishedOnly, CancellationToken cancellationToken) =>
        (await queries.GetMaterialsAsync(publishedOnly, cancellationToken)).Select(ToResponse).ToList();

    public async Task<(Guid? Id, Dictionary<string, string[]> Errors)> CreateChallengeAsync(ChallengeInput input, CancellationToken cancellationToken)
    {
        var errors = ValidateChallenge(input);
        if (errors.Count > 0)
            return (null, errors);

        var challenge = Challenge.CreateDraft(input.Title!, input.Description!, input.CategoryId, input.Source, Now);
        challenges.Add(challenge);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return (challenge.Id, errors);
    }

    public async Task<EditResult> UpdateChallengeAsync(Guid id, ChallengeInput input, CancellationToken cancellationToken)
    {
        var challenge = await challenges.FindForUpdateAsync(id, cancellationToken);
        if (challenge is null)
            return EditResult.NotFound;
        var errors = ValidateChallenge(input);
        if (errors.Count > 0)
            return new EditResult(true, errors);

        challenge.Update(input.Title!, input.Description!, input.CategoryId, input.Source, Now);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return EditResult.Done;
    }

    public async Task<EditResult> ChangeChallengeAsync(Guid id, PublicationAction action, CancellationToken cancellationToken)
    {
        var challenge = await challenges.FindForUpdateAsync(id, cancellationToken);
        if (challenge is null)
            return EditResult.NotFound;

        Apply(action, challenge.Verify, challenge.Publish, challenge.Unpublish);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return EditResult.Done;
    }

    public async Task<EditResult> DeleteChallengeAsync(Guid id, CancellationToken cancellationToken)
    {
        var challenge = await challenges.FindForUpdateAsync(id, cancellationToken);
        if (challenge is null)
            return EditResult.NotFound;

        challenges.Remove(challenge);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return EditResult.Done;
    }

    public async Task<(Guid? Id, Dictionary<string, string[]> Errors)> CreateMaterialAsync(MaterialInput input, CancellationToken cancellationToken)
    {
        var errors = ValidateMaterial(input, out var type);
        if (errors.Count > 0)
            return (null, errors);

        var material = Material.CreateDraft(input.Title!, input.Summary!, type, input.Url, input.Body, Now);
        materials.Add(material);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return (material.Id, errors);
    }

    public async Task<EditResult> UpdateMaterialAsync(Guid id, MaterialInput input, CancellationToken cancellationToken)
    {
        var material = await materials.FindForUpdateAsync(id, cancellationToken);
        if (material is null)
            return EditResult.NotFound;
        var errors = ValidateMaterial(input, out var type);
        if (errors.Count > 0)
            return new EditResult(true, errors);

        material.Update(input.Title!, input.Summary!, type, input.Url, input.Body, Now);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return EditResult.Done;
    }

    public async Task<EditResult> ChangeMaterialAsync(Guid id, PublicationAction action, CancellationToken cancellationToken)
    {
        var material = await materials.FindForUpdateAsync(id, cancellationToken);
        if (material is null)
            return EditResult.NotFound;

        Apply(action, material.Verify, material.Publish, material.Unpublish);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return EditResult.Done;
    }

    public async Task<EditResult> DeleteMaterialAsync(Guid id, CancellationToken cancellationToken)
    {
        var material = await materials.FindForUpdateAsync(id, cancellationToken);
        if (material is null)
            return EditResult.NotFound;

        materials.Remove(material);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return EditResult.Done;
    }

    private DateTime Now => clock.GetUtcNow().UtcDateTime;

    private void Apply(PublicationAction action, Action<DateTime> verify, Action<DateTime> publish, Action<DateTime> unpublish)
    {
        var step = action switch
        {
            PublicationAction.Verify => verify,
            PublicationAction.Publish => publish,
            _ => unpublish
        };
        step(Now);
    }

    private static Dictionary<string, string[]> ValidateChallenge(ChallengeInput input)
    {
        var errors = new Dictionary<string, string[]>();
        if (string.IsNullOrWhiteSpace(input.Title) || input.Title.Trim().Length > 300)
            errors["title"] = ["Podaj tytuł (najwyżej 300 znaków)."];
        if (string.IsNullOrWhiteSpace(input.Description) || input.Description.Trim().Length > 8000)
            errors["description"] = ["Podaj opis (najwyżej 8000 znaków)."];
        if (input.Source?.Trim().Length > 500)
            errors["source"] = ["Najwyżej 500 znaków."];
        return errors;
    }

    private static Dictionary<string, string[]> ValidateMaterial(MaterialInput input, out MaterialType type)
    {
        var errors = new Dictionary<string, string[]>();
        if (!Enum.TryParse(input.Type?.Trim(), ignoreCase: true, out type) || !Enum.IsDefined(type))
            errors["type"] = ["Wybierz rodzaj materiału."];
        if (string.IsNullOrWhiteSpace(input.Title) || input.Title.Trim().Length > 300)
            errors["title"] = ["Podaj tytuł (najwyżej 300 znaków)."];
        if (string.IsNullOrWhiteSpace(input.Summary) || input.Summary.Trim().Length > 1000)
            errors["summary"] = ["Podaj krótki opis (najwyżej 1000 znaków)."];
        if (!string.IsNullOrWhiteSpace(input.Url) && !InnovationEditingService.IsHttpUrl(input.Url))
            errors["url"] = ["Podaj pełny adres zaczynający się od https://."];
        if (string.IsNullOrWhiteSpace(input.Url) && string.IsNullOrWhiteSpace(input.Body))
            errors["url"] = ["Podaj link albo wpisz treść materiału."];
        if (input.Body?.Trim().Length > 20000)
            errors["body"] = ["Najwyżej 20000 znaków."];
        return errors;
    }

    private static ChallengeResponse ToResponse(Challenge c) =>
        new(c.Id, c.Title, c.Description, c.CategoryId, c.Source, c.Status, c.UpdatedAt);

    private static MaterialResponse ToResponse(Material m) =>
        new(m.Id, m.Title, m.Summary, m.Type, m.Url, m.Body, m.Status, m.UpdatedAt);
}
