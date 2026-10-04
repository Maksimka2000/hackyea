using HubMi.Domain.Canvases;

namespace HubMi.Features.Canvases.Ports;

/// <summary>
/// One board of a canvas. <see cref="Type"/>: <c>text</c> (free answer), <c>amount</c> (a sum in PLN) or <c>plan</c>
/// (rows of action, months and cost, grouped in <see cref="Phases"/>).
/// </summary>
public sealed record CanvasBoard(
    string Key,
    string Number,
    string Title,
    string? Hint,
    IReadOnlyList<string> Questions,
    string Type,
    int? MaxLength,
    IReadOnlyList<CanvasPlanPhase>? Phases,
    IReadOnlyList<CanvasPlanPeriod>? Periods);

/// <summary>A stretch of the plan with a length limit set by the call, e.g. preparation (3 months) or testing (9 months).</summary>
public sealed record CanvasPlanPeriod(string Key, string Title, int MaxMonths);

/// <summary>A group of plan rows. Phases sharing a <see cref="Period"/> count together towards that period's month limit.</summary>
public sealed record CanvasPlanPhase(string Key, string Title, string? Hint, string Period);

/// <summary>
/// A canvas template built from a call's application form. <see cref="CallId"/> and the availability window are the
/// extension point for a call-specific application generator: always-available templates leave them empty.
/// </summary>
public sealed record CanvasTemplate(
    string Key,
    string Title,
    string Description,
    string Source,
    string? CallId,
    DateTime? AvailableFrom,
    DateTime? AvailableTo,
    IReadOnlyList<CanvasBoard> Boards);

public interface ICanvasTemplateSource
{
    Task<IReadOnlyList<CanvasTemplate>> GetAllAsync(CancellationToken cancellationToken);
}

public interface ICanvasStore
{
    void Add(InnovationCanvas canvas);

    void Remove(InnovationCanvas canvas);

    Task<InnovationCanvas?> FindForUpdateAsync(Guid id, CancellationToken cancellationToken);
}

public interface ICanvasQueries
{
    /// <summary>The owner's canvases, last edited first.</summary>
    Task<IReadOnlyList<InnovationCanvas>> GetByOwnerAsync(Guid ownerId, CancellationToken cancellationToken);

    Task<InnovationCanvas?> GetAsync(Guid id, CancellationToken cancellationToken);
}
