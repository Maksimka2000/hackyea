using HubMi.Domain.Notifications;

namespace HubMi.Features.Notifications.Ports;

/// <summary>
/// The inbox of one reader: a user's own notices, or, for staff, the shared staff notices.
/// <paramref name="userId"/> is used when <c>forStaff</c> is false.
/// </summary>
public interface INotificationStore
{
    void Add(Notification notification);

    Task<IReadOnlyList<Notification>> GetAsync(Guid userId, bool forStaff, bool unreadOnly, int limit, CancellationToken cancellationToken);

    Task<int> CountUnreadAsync(Guid userId, bool forStaff, CancellationToken cancellationToken);

    /// <summary>Tracked, so a change is saved by the unit of work. Null when it does not exist or belongs to another reader.</summary>
    Task<Notification?> FindAsync(Guid id, Guid userId, bool forStaff, CancellationToken cancellationToken);

    /// <summary>Tracked unread notices of the reader, oldest first.</summary>
    Task<IReadOnlyList<Notification>> GetUnreadForUpdateAsync(Guid userId, bool forStaff, CancellationToken cancellationToken);
}
