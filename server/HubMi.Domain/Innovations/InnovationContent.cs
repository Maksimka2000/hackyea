namespace HubMi.Domain.Innovations;

/// <summary>The editable text and links of a library card, as staff enter them in the admin panel.</summary>
public sealed record InnovationContent(
    string CategoryId,
    string Title,
    string? Tagline,
    string? Solution,
    string? Problems,
    string? TargetGroup,
    string? Beneficiaries,
    string? Evidence,
    string SourceUrl,
    string? VideoUrl,
    string? MaterialsUrl,
    string? DetailsPdfUrl,
    string LicenseUrl,
    string? DisseminationBadge);
