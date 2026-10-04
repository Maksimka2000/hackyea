using HubMi.Domain.Notifications;
using HubMi.Features.Notifications.Ports;
using Microsoft.EntityFrameworkCore;

namespace HubMi.Infrastructure.Persistence.Repositories;

internal sealed class NotificationStore(HubMiDbContext db) : INotificationStore
{
    public void Add(Notification notification) => db.Notifications.Add(notification);

    public async Task<IReadOnlyList<Notification>> GetAsync(
        Guid userId, bool forStaff, bool unreadOnly, int limit, CancellationToken cancellationToken) =>
        await Inbox(db.Notifications.AsNoTracking(), userId, forStaff)
            .Where(n => !unreadOnly || n.ReadAt == null)
            .OrderByDescending(n => n.CreatedAt)
            .Take(limit)
            .ToListAsync(cancellationToken);

    public Task<int> CountUnreadAsync(Guid userId, bool forStaff, CancellationToken cancellationToken) =>
        Inbox(db.Notifications.AsNoTracking(), userId, forStaff).CountAsync(n => n.ReadAt == null, cancellationToken);

    public Task<Notification?> FindAsync(Guid id, Guid userId, bool forStaff, CancellationToken cancellationToken) =>
        Inbox(db.Notifications, userId, forStaff).FirstOrDefaultAsync(n => n.Id == id, cancellationToken);

    public async Task<IReadOnlyList<Notification>> GetUnreadForUpdateAsync(Guid userId, bool forStaff, CancellationToken cancellationToken) =>
        await Inbox(db.Notifications, userId, forStaff)
            .Where(n => n.ReadAt == null)
            .OrderBy(n => n.CreatedAt)
            .ToListAsync(cancellationToken);

    private static IQueryable<Notification> Inbox(IQueryable<Notification> query, Guid userId, bool forStaff) =>
        forStaff ? query.Where(n => n.ForStaff) : query.Where(n => n.RecipientUserId == userId);
}
