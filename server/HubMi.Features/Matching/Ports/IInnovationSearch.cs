using HubMi.Domain.Innovations;

namespace HubMi.Features.Matching.Ports;

/// <summary>Retrieval of published innovation cards. Ranking and the match indicator are computed by the feature, not by the store.</summary>
public interface IInnovationSearch
{
    /// <summary>Published cards by id, in no particular order. Ids of unpublished or missing cards are skipped.</summary>
    Task<IReadOnlyList<Innovation>> GetByIdsAsync(IReadOnlyCollection<Guid> ids, CancellationToken cancellationToken);

    /// <summary>
    /// Keyword fallback, used only while the meaning index is unavailable: cards containing any word that starts with one of the
    /// given (accent-folded, lower-case) prefixes, best store ranking first.
    /// </summary>
    Task<IReadOnlyList<Innovation>> FindCandidatesAsync(IReadOnlyCollection<string> prefixes, int limit, CancellationToken cancellationToken);
}
