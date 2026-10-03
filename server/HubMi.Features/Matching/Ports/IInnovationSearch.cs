using HubMi.Domain.Innovations;

namespace HubMi.Features.Matching.Ports;

/// <summary>Retrieval of published innovation cards. Ranking and the match indicator are computed by the feature, not by the store.</summary>
public interface IInnovationSearch
{
    /// <summary>Cards containing any word that starts with one of the given (accent-folded, lower-case) prefixes, best store ranking first.</summary>
    Task<IReadOnlyList<Innovation>> FindCandidatesAsync(IReadOnlyCollection<string> prefixes, int limit, CancellationToken cancellationToken);

    /// <summary>Typo-tolerant fallback on title and tagline for texts that share no exact word prefixes.</summary>
    Task<IReadOnlyList<Innovation>> FindSimilarAsync(string text, IReadOnlyCollection<string> excludeIds, int limit, CancellationToken cancellationToken);

    /// <summary>Last-resort cards so a result list is never short: the preferred (or largest) category first.</summary>
    Task<IReadOnlyList<Innovation>> GetFillersAsync(string? preferredCategoryId, IReadOnlyCollection<string> excludeIds, int limit, CancellationToken cancellationToken);
}
