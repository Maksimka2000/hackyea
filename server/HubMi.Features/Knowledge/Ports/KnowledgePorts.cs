using HubMi.Domain.Innovations;
using HubMi.Domain.Knowledge;

namespace HubMi.Features.Knowledge.Ports;

/// <summary>Write side of the library cards for staff editing. Loaded entities are tracked; the unit of work saves them.</summary>
public interface IInnovationEditor
{
    void Add(Innovation innovation);

    void Remove(Innovation innovation);

    Task<Innovation?> FindForUpdateAsync(Guid id, CancellationToken cancellationToken);
}

public interface IChallengeStore
{
    void Add(Challenge challenge);

    void Remove(Challenge challenge);

    Task<Challenge?> FindForUpdateAsync(Guid id, CancellationToken cancellationToken);
}

public interface IMaterialStore
{
    void Add(Material material);

    void Remove(Material material);

    Task<Material?> FindForUpdateAsync(Guid id, CancellationToken cancellationToken);
}

public sealed record InnovationAdminRow(
    Guid Id, string Title, string CategoryId, PublicationStatus Status, DateTime UpdatedAt, double? AverageRating, int RatingCount);

public interface IKnowledgeQueries
{
    /// <summary>Every card whatever its status, newest change first, optionally filtered.</summary>
    Task<IReadOnlyList<InnovationAdminRow>> GetInnovationsAsync(
        PublicationStatus? status, string? categoryId, string? query, CancellationToken cancellationToken);

    Task<Innovation?> GetInnovationAsync(Guid id, CancellationToken cancellationToken);

    /// <summary>All challenges, or only published ones for the public knowledge page.</summary>
    Task<IReadOnlyList<Challenge>> GetChallengesAsync(bool publishedOnly, CancellationToken cancellationToken);

    Task<IReadOnlyList<Material>> GetMaterialsAsync(bool publishedOnly, CancellationToken cancellationToken);
}
