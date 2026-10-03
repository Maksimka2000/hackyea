using System.Text.Json;
using HubMi.Domain.Innovations;

namespace HubMi.Infrastructure.Imports.Adapters;

public sealed record ImportedLibrary(IReadOnlyList<InnovationCategory> Categories, IReadOnlyList<Innovation> Innovations);

/// <summary>
/// Reads the ROPS Library of Social Innovations sample export (one JSON array of cards) into domain entities.
/// Author and phone fields are not read: the contest rules forbid real personal data.
/// </summary>
public sealed class RopsLibraryJsonAdapter
{
    private const string RopsOrigin = "https://rops.krakow.pl";

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
        PropertyNameCaseInsensitive = true
    };

    public async Task<ImportedLibrary> ReadAsync(Stream json, DateTime now, CancellationToken cancellationToken)
    {
        var cards = await JsonSerializer.DeserializeAsync<List<RawCard>>(json, JsonOptions, cancellationToken)
                    ?? throw new InvalidDataException("Library file is empty.");

        var categories = new List<InnovationCategory>();
        var seenCategories = new HashSet<string>(StringComparer.Ordinal);
        var innovations = new List<Innovation>(cards.Count);

        foreach (var card in cards)
        {
            if (seenCategories.Add(card.CategorySlug))
                categories.Add(InnovationCategory.Create(card.CategorySlug, card.Category, categories.Count));

            innovations.Add(Innovation.Create(
                DeterministicGuid.FromSlug(card.Id),
                card.CategorySlug,
                card.Title,
                string.IsNullOrWhiteSpace(card.Tagline) ? FirstSentence(card.Solution) : card.Tagline,
                card.Solution,
                card.Problems,
                card.TargetGroup,
                card.Beneficiaries,
                card.Evidence,
                Absolute(card.Url)!,
                Absolute(card.Links?.Video),
                Absolute(card.Links?.MaterialsZip),
                Absolute(card.Links?.DetailsPdf),
                Absolute(card.Links?.License)!,
                card.SelectedForDissemination,
                now));
        }

        return new ImportedLibrary(categories, innovations);
    }

    private static string? Absolute(string? url)
    {
        if (string.IsNullOrWhiteSpace(url))
            return null;

        return url.StartsWith('/') ? RopsOrigin + url : url;
    }

    private static string? FirstSentence(string? text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return null;

        var end = text.IndexOf(". ", StringComparison.Ordinal);
        var sentence = end > 0 ? text[..end] : text;
        return sentence.Length > 300 ? sentence[..300].TrimEnd() + "…" : sentence;
    }

    private sealed record RawCard(
        string Id,
        string CategorySlug,
        string Category,
        string Title,
        string? Tagline,
        string? SelectedForDissemination,
        string Url,
        string? Solution,
        string? Problems,
        string? TargetGroup,
        string? Beneficiaries,
        string? Evidence,
        RawLinks? Links);

    private sealed record RawLinks(string? DetailsPdf, string? Video, string? MaterialsZip, string? License);
}
