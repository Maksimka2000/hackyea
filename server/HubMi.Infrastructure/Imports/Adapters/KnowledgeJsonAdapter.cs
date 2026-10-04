using System.Text.Json;
using HubMi.Domain.Knowledge;

namespace HubMi.Infrastructure.Imports.Adapters;

/// <summary>Reads the starter knowledge store (<c>knowledge.json</c>) into published challenges and materials.</summary>
internal sealed class KnowledgeJsonAdapter
{
    private static readonly JsonSerializerOptions Json = new() { PropertyNameCaseInsensitive = true };

    public async Task<(IReadOnlyList<Challenge> Challenges, IReadOnlyList<Material> Materials)> ReadAsync(
        Stream json, IReadOnlySet<string> categoryIds, DateTime now, CancellationToken cancellationToken)
    {
        var file = await JsonSerializer.DeserializeAsync<KnowledgeFile>(json, Json, cancellationToken)
                   ?? throw new InvalidOperationException("knowledge.json is empty.");

        var challenges = file.Challenges.Select(c =>
        {
            var challenge = Challenge.CreateDraft(
                c.Title, c.Description, c.CategoryId is not null && categoryIds.Contains(c.CategoryId) ? c.CategoryId : null, c.Source, now);
            challenge.Verify(now);
            challenge.Publish(now);
            return challenge;
        }).ToList();

        var materials = file.Materials.Select(m =>
        {
            var material = Material.CreateDraft(m.Title, m.Summary, Enum.Parse<MaterialType>(m.Type, ignoreCase: true), m.Url, m.Body, now);
            material.Verify(now);
            material.Publish(now);
            return material;
        }).ToList();

        return (challenges, materials);
    }

    private sealed record KnowledgeFile(IReadOnlyList<ChallengeEntry> Challenges, IReadOnlyList<MaterialEntry> Materials);

    private sealed record ChallengeEntry(string Title, string Description, string? CategoryId, string? Source);

    private sealed record MaterialEntry(string Title, string Summary, string Type, string? Url, string? Body);
}
