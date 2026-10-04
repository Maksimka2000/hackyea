namespace HubMi.Features.Innovations.Contracts;

/// <summary>The full library card, using the six official ROPS sections plus links and credit.</summary>
public sealed record InnovationDetailsResponse(
    Guid Id,
    string Title,
    string? Tagline,
    InnovationCategoryDto Category,
    string? Solution,
    string? Problems,
    string? TargetGroup,
    string? Beneficiaries,
    string? Evidence,
    string? DisseminationBadge,
    string SourceUrl,
    string? VideoUrl,
    string? MaterialsUrl,
    string? DetailsPdfUrl,
    string LicenseUrl,
    DateTime UpdatedAt,
    double? AverageRating,
    int RatingCount);

public sealed record InnovationCategoryDto(string Id, string Name);
