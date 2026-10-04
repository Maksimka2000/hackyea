namespace HubMi.Features.Common.Ports;

/// <summary>
/// The commit boundary of a workflow. Stores add and load tracked entities; the feature service commits once at the end,
/// so e.g. a submission and the notifications it triggers are saved together or not at all.
/// </summary>
public interface IUnitOfWork
{
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
