using HubMi.Domain.Accounts;
using HubMi.Features.Accounts;
using HubMi.Features.Common.Ports;
using HubMi.Features.Notifications.Contracts;
using HubMi.Features.Notifications.Ports;

namespace HubMi.Features.Notifications.Services;

/// <summary>Reading and dismissing notices. Staff share one inbox; everyone else sees their own.</summary>
public sealed class NotificationService(INotificationStore store, IUnitOfWork unitOfWork, TimeProvider clock)
{
    public const int ListLimit = 50;

    public async Task<IReadOnlyList<NotificationResponse>> GetAsync(CurrentUser user, bool unreadOnly, CancellationToken cancellationToken) =>
        (await store.GetAsync(user.Id, IsStaff(user), unreadOnly, ListLimit, cancellationToken))
        .Select(n => new NotificationResponse(n.Id, n.Kind, n.Summary, n.SubmissionId, n.InnovationId, n.CreatedAt, n.ReadAt))
        .ToList();

    public async Task<int> CountUnreadAsync(CurrentUser user, CancellationToken cancellationToken) =>
        await store.CountUnreadAsync(user.Id, IsStaff(user), cancellationToken);

    public async Task<bool> MarkReadAsync(CurrentUser user, Guid id, CancellationToken cancellationToken)
    {
        var notification = await store.FindAsync(id, user.Id, IsStaff(user), cancellationToken);
        if (notification is null)
            return false;

        notification.MarkRead(clock.GetUtcNow().UtcDateTime);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task MarkAllReadAsync(CurrentUser user, CancellationToken cancellationToken)
    {
        var now = clock.GetUtcNow().UtcDateTime;
        foreach (var notification in await store.GetUnreadForUpdateAsync(user.Id, IsStaff(user), cancellationToken))
            notification.MarkRead(now);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private static bool IsStaff(CurrentUser user) => user.Role == AccountRoles.Admin;
}
