using System.Text.Json;
using HubMi.Features.Canvases.Ports;

namespace HubMi.Infrastructure.Imports.Adapters;

/// <summary>
/// Canvas templates from <c>Imports/SampleData/canvas-templates.json</c> (the ROPS call form turned into boards).
/// Read once; templates change with a deployment, not at run time.
/// </summary>
internal sealed class JsonCanvasTemplateSource : ICanvasTemplateSource
{
    private static readonly string TemplatesPath = Path.Combine(AppContext.BaseDirectory, "Imports", "SampleData", "canvas-templates.json");
    private static readonly JsonSerializerOptions Json = new() { PropertyNameCaseInsensitive = true };

    private readonly Lazy<Task<IReadOnlyList<CanvasTemplate>>> _templates = new(LoadAsync);

    public Task<IReadOnlyList<CanvasTemplate>> GetAllAsync(CancellationToken cancellationToken) => _templates.Value;

    private static async Task<IReadOnlyList<CanvasTemplate>> LoadAsync()
    {
        await using var file = File.OpenRead(TemplatesPath);
        return await JsonSerializer.DeserializeAsync<List<CanvasTemplate>>(file, Json)
               ?? throw new InvalidOperationException("canvas-templates.json is empty.");
    }
}
