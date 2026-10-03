namespace HubMi.Domain.Innovations;

/// <summary>One card of the ROPS Library of Social Innovations.</summary>
public sealed class Innovation
{
    private Innovation()
    {
    }

    public string Id { get; private set; } = null!;
    public string CategoryId { get; private set; } = null!;
    public string Title { get; private set; } = null!;
    public string? Tagline { get; private set; }
    public string? Solution { get; private set; }
    public string? Problems { get; private set; }
    public string? TargetGroup { get; private set; }
    public string? Beneficiaries { get; private set; }
    public string? Evidence { get; private set; }
    public string SourceUrl { get; private set; } = null!;
    public string? VideoUrl { get; private set; }
    public string? MaterialsUrl { get; private set; }
    public string? DetailsPdfUrl { get; private set; }
    public string LicenseUrl { get; private set; } = null!;
    public string? DisseminationBadge { get; private set; }
    public bool IsPublished { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    public static Innovation Create(
        string id,
        string categoryId,
        string title,
        string? tagline,
        string? solution,
        string? problems,
        string? targetGroup,
        string? beneficiaries,
        string? evidence,
        string sourceUrl,
        string? videoUrl,
        string? materialsUrl,
        string? detailsPdfUrl,
        string licenseUrl,
        string? disseminationBadge,
        DateTime now)
    {
        Require(id, nameof(id));
        Require(categoryId, nameof(categoryId));
        Require(title, nameof(title));
        Require(sourceUrl, nameof(sourceUrl));
        Require(licenseUrl, nameof(licenseUrl));

        return new Innovation
        {
            Id = id.Trim(),
            CategoryId = categoryId.Trim(),
            Title = title.Trim(),
            Tagline = Clean(tagline),
            Solution = Clean(solution),
            Problems = Clean(problems),
            TargetGroup = Clean(targetGroup),
            Beneficiaries = Clean(beneficiaries),
            Evidence = Clean(evidence),
            SourceUrl = sourceUrl.Trim(),
            VideoUrl = Clean(videoUrl),
            MaterialsUrl = Clean(materialsUrl),
            DetailsPdfUrl = Clean(detailsPdfUrl),
            LicenseUrl = licenseUrl.Trim(),
            DisseminationBadge = Clean(disseminationBadge),
            IsPublished = true,
            UpdatedAt = now
        };
    }

    private static void Require(string? value, string name)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException($"{name} is required.", name);
    }

    private static string? Clean(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
