namespace HubMi.Features.Innovations.Contracts;

/// <summary>The short form of a library card, for lists (featured, related and the catalogue).</summary>
public sealed record InnovationSummaryResponse(
    Guid Id,
    string Title,
    string? Tagline,
    InnovationCategoryDto Category,
    string? DisseminationBadge,
    bool HasVideo,
    bool HasEvidence);

/// <summary>A library category with the number of published cards in it.</summary>
public sealed record InnovationCategorySummaryResponse(string Id, string Name, int InnovationCount);
