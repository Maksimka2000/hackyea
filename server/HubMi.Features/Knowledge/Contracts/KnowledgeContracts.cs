using HubMi.Domain.Innovations;
using HubMi.Domain.Knowledge;

namespace HubMi.Features.Knowledge.Contracts;

/// <summary>Staff input for a library card. Source and licence links default to the HubMI card page and CC BY 4.0 when left empty.</summary>
public sealed class InnovationInput
{
    public string? CategoryId { get; init; }
    public string? Title { get; init; }
    public string? Tagline { get; init; }
    public string? Solution { get; init; }
    public string? Problems { get; init; }
    public string? TargetGroup { get; init; }
    public string? Beneficiaries { get; init; }
    public string? Evidence { get; init; }
    public string? SourceUrl { get; init; }
    public string? VideoUrl { get; init; }
    public string? MaterialsUrl { get; init; }
    public string? DetailsPdfUrl { get; init; }
    public string? LicenseUrl { get; init; }
    public string? DisseminationBadge { get; init; }
}

public sealed record AdminInnovationRowResponse(
    Guid Id, string Title, string CategoryId, string? CategoryName, PublicationStatus Status, DateTime UpdatedAt,
    double? AverageRating, int RatingCount);

public sealed record AdminInnovationResponse(
    Guid Id,
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
    string? DisseminationBadge,
    PublicationStatus Status,
    DateTime? VerifiedAt,
    DateTime UpdatedAt);

public sealed class ChallengeInput
{
    public string? Title { get; init; }
    public string? Description { get; init; }
    public string? CategoryId { get; init; }
    public string? Source { get; init; }
}

public sealed record ChallengeResponse(
    Guid Id, string Title, string Description, string? CategoryId, string? Source, PublicationStatus Status, DateTime UpdatedAt);

public sealed class MaterialInput
{
    public string? Title { get; init; }
    public string? Summary { get; init; }
    public string? Type { get; init; }
    public string? Url { get; init; }
    public string? Body { get; init; }
}

public sealed record MaterialResponse(
    Guid Id, string Title, string Summary, MaterialType Type, string? Url, string? Body, PublicationStatus Status, DateTime UpdatedAt);

public sealed record CreatedResponse(Guid Id);
