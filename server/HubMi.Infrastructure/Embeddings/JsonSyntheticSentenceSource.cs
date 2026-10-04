using System.Text.Json;
using HubMi.Features.Matching.Ports;
using Microsoft.Extensions.Logging;

namespace HubMi.Infrastructure.Embeddings;

/// <summary>
/// Reads the reviewed doc2query sentences from <c>Imports/SampleData/synthetic-sentences.json</c>: an object whose keys are card
/// slugs (the part of the source URL after the last comma) and whose values are lists of sentences. A missing file means no synthetic rows.
/// </summary>
internal sealed class JsonSyntheticSentenceSource : ISyntheticSentenceSource
{
    private readonly Dictionary<string, IReadOnlyList<string>> _sentences = new(StringComparer.OrdinalIgnoreCase);

    public JsonSyntheticSentenceSource(ILogger<JsonSyntheticSentenceSource> logger)
    {
        var path = Path.Combine(AppContext.BaseDirectory, "Imports", "SampleData", "synthetic-sentences.json");
        if (!File.Exists(path))
        {
            logger.LogInformation("No synthetic sentences file; only the card rows are embedded.");
            return;
        }

        try
        {
            var data = JsonSerializer.Deserialize<Dictionary<string, List<string>>>(File.ReadAllText(path)) ?? [];
            foreach (var (slug, sentences) in data)
            {
                _sentences[slug] = sentences
                    .Where(s => !string.IsNullOrWhiteSpace(s))
                    .Select(s => s.Trim())
                    .Distinct()
                    .ToList();
            }
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Synthetic sentences could not be read; only the card rows are embedded.");
        }
    }

    public IReadOnlyList<string> For(string sourceUrl)
    {
        var slug = sourceUrl[(sourceUrl.LastIndexOf(',') + 1)..].Trim('/');
        return _sentences.GetValueOrDefault(slug, []);
    }
}
