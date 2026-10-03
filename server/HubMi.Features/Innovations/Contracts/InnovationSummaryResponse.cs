namespace HubMi.Features.Innovations.Contracts;

/// <summary>The short form of a library card, for lists (featured and related).</summary>
public sealed record InnovationSummaryResponse(Guid Id, string Title, string? Tagline, InnovationCategoryDto Category);
