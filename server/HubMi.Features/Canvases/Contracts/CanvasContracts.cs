using System.Text.Json;
using HubMi.Features.Canvases.Ports;

namespace HubMi.Features.Canvases.Contracts;

public sealed class CreateCanvasRequest
{
    public string? TemplateKey { get; init; }
    public string? Title { get; init; }
}

/// <summary>
/// The whole canvas. <c>content</c> is an object keyed by board: text boards hold a string, the amount board a number,
/// the plan board an object keyed by phase, each an array of <c>{ action, from, to, cost }</c> rows (<c>from</c>/<c>to</c> as yyyy-MM).
/// </summary>
public sealed class UpdateCanvasRequest
{
    public string? Title { get; init; }
    public JsonElement? Content { get; init; }
}

/// <summary>A check that does not block saving, e.g. the plan costs do not add up to the requested grant.</summary>
public sealed record CanvasWarning(string Code, string Message, string? Board);

public sealed record CanvasSummaryResponse(Guid Id, string TemplateKey, string Title, bool Submitted, DateTime UpdatedAt);

public sealed record CanvasResponse(
    Guid Id,
    string TemplateKey,
    string Title,
    JsonElement Content,
    Guid? SubmissionId,
    DateTime UpdatedAt,
    IReadOnlyList<CanvasWarning> Warnings);

public sealed record CanvasTemplateResponse(
    string Key,
    string Title,
    string Description,
    string Source,
    IReadOnlyList<CanvasBoard> Boards);
