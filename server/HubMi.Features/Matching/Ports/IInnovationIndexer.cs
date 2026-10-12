namespace HubMi.Features.Matching.Ports;

/// <summary>
/// Keeps card vectors in step with card text. Whatever creates or edits a card (import, a future admin save)
/// calls this so the search reflects the new text without a restart; the background refresher does the same for edits it notices.
/// </summary>
public interface IInnovationIndexer
{
    /// <summary>Re-embeds the rows of the card (or of every card when null) whose text or model changed and deletes stale rows.</summary>
    Task ReindexAsync(Guid? innovationId, CancellationToken cancellationToken);
}
