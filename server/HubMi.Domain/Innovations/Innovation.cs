namespace HubMi.Domain.Innovations;

/// <summary>One card of the ROPS Library of Social Innovations.</summary>
public sealed class Innovation
{
    private Innovation()
    {
    }

    public Guid Id { get; private set; }
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
        Guid id,
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
        if (id == Guid.Empty)
            throw new ArgumentException("Id is required.", nameof(id));
        Require(categoryId, nameof(categoryId));
        Require(title, nameof(title));
        Require(sourceUrl, nameof(sourceUrl));
        Require(licenseUrl, nameof(licenseUrl));

        return new Innovation
        {
            Id = id,
            CategoryId = categoryId.Trim(),
            Title = Clean(title)!,
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

    /// <summary>
    /// Trims the text and removes the invisible characters the ROPS export contains: non-breaking spaces become normal
    /// spaces (so words wrap), zero-width characters are dropped. Line breaks are kept: they separate paragraphs.
    /// </summary>
    private static string? Clean(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return null;

        var cleaned = value
            .Replace(' ', ' ')
            .Replace(' ', ' ')
            .Replace("​", string.Empty)
            .Replace("‌", string.Empty)
            .Replace("‍", string.Empty)
            .Replace("﻿", string.Empty)
            .Trim();

        return cleaned.Length == 0 ? null : cleaned;
    }
}
