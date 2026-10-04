namespace HubMi.Features.Matching.Ports;

/// <summary>
/// Keeps card vectors in step with card text. Whatever creates or edits a card (import, a future admin save)
/// calls this so the search reflects the new text without a restart; the background refresher does the same for other instances.
/// </summary>
public interface IInnovationIndexer
{
    /// <summary>Re-embeds the card (or every card when null) whose text changed, then refreshes the in-memory index.</summary>
    Task ReindexAsync(Guid? innovationId, CancellationToken cancellationToken);
}
