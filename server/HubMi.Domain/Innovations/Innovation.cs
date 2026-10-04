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
    /// <summary>Kept in step with <see cref="Status"/>: true exactly when the card is published. Search queries filter on it.</summary>
    public bool IsPublished { get; private set; }
    public PublicationStatus Status { get; private set; }
    public Guid? VerifiedBy { get; private set; }
    public DateTime? VerifiedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    /// <summary>A card written by ROPS staff (or promoted from a submitted idea). It starts as a draft, hidden from the public.</summary>
    public static Innovation CreateDraft(Guid id, InnovationContent content, DateTime now)
    {
        var innovation = Create(
            id,
            content.CategoryId,
            content.Title,
            content.Tagline,
            content.Solution,
            content.Problems,
            content.TargetGroup,
            content.Beneficiaries,
            content.Evidence,
            content.SourceUrl,
            content.VideoUrl,
            content.MaterialsUrl,
            content.DetailsPdfUrl,
            content.LicenseUrl,
            content.DisseminationBadge,
            now);

        innovation.SetStatus(PublicationStatus.Draft);
        return innovation;
    }

    /// <summary>Edits the card text. A verified card goes back to draft because the new text has not been checked yet.</summary>
    public void Update(InnovationContent content, DateTime now)
    {
        Require(content.CategoryId, nameof(content.CategoryId));
        Require(content.Title, nameof(content.Title));
        Require(content.SourceUrl, nameof(content.SourceUrl));
        Require(content.LicenseUrl, nameof(content.LicenseUrl));

        CategoryId = content.CategoryId.Trim();
        Title = Clean(content.Title)!;
        Tagline = Clean(content.Tagline);
        Solution = Clean(content.Solution);
        Problems = Clean(content.Problems);
        TargetGroup = Clean(content.TargetGroup);
        Beneficiaries = Clean(content.Beneficiaries);
        Evidence = Clean(content.Evidence);
        SourceUrl = content.SourceUrl.Trim();
        VideoUrl = Clean(content.VideoUrl);
        MaterialsUrl = Clean(content.MaterialsUrl);
        DetailsPdfUrl = Clean(content.DetailsPdfUrl);
        LicenseUrl = content.LicenseUrl.Trim();
        DisseminationBadge = Clean(content.DisseminationBadge);

        if (Status == PublicationStatus.Verified)
            SetStatus(PublicationStatus.Draft);

        UpdatedAt = now;
    }

    public void Verify(Guid staffId, DateTime now)
    {
        if (Status == PublicationStatus.Published)
            throw new DomainException("Opublikowana karta jest już zweryfikowana.");

        VerifiedBy = staffId;
        VerifiedAt = now;
        SetStatus(PublicationStatus.Verified);
        UpdatedAt = now;
    }

    /// <summary>Only a verified card can be published, so nothing reaches the public unchecked.</summary>
    public void Publish(DateTime now)
    {
        if (Status != PublicationStatus.Verified)
            throw new DomainException("Zweryfikuj kartę przed publikacją.");

        SetStatus(PublicationStatus.Published);
        UpdatedAt = now;
    }

    public void Unpublish(DateTime now)
    {
        if (Status != PublicationStatus.Published)
            return;

        SetStatus(PublicationStatus.Verified);
        UpdatedAt = now;
    }

    private void SetStatus(PublicationStatus status)
    {
        Status = status;
        IsPublished = status == PublicationStatus.Published;
    }

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
            Status = PublicationStatus.Published,
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
