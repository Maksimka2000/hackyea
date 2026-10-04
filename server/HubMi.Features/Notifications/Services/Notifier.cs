using HubMi.Domain.Notifications;
using HubMi.Domain.Submissions;
using HubMi.Features.Notifications.Ports;

namespace HubMi.Features.Notifications.Services;

/// <summary>
/// Writes the in-app notices other workflows trigger. It only adds them to the open unit of work: the calling service
/// commits them together with the change that caused them. Delivery is by polling; e-mail or push can be added here later.
/// </summary>
public sealed class Notifier(INotificationStore store, TimeProvider clock)
{
    public void SubmissionCreated(Submission submission) =>
        store.Add(Notification.ToStaff(
            NotificationKind.SubmissionCreated, $"{submission.Number}: {submission.Title}", submission.Id, null, Now));

    public void SubmitterWrote(Submission submission) =>
        store.Add(Notification.ToStaff(
            NotificationKind.SubmitterMessage, $"{submission.Number}: {submission.Title}", submission.Id, null, Now));

    public void StaffReplied(Submission submission) =>
        store.Add(Notification.ToUser(
            submission.AuthorId, NotificationKind.StaffReply, $"{submission.Number}: {submission.Title}", submission.Id, null, Now));

    public void StatusChanged(Submission submission) =>
        store.Add(Notification.ToUser(
            submission.AuthorId, NotificationKind.StatusChanged, $"{submission.Number}: {submission.Title}", submission.Id, null, Now));

    public void FeedbackReceived(Guid innovationId, string innovationTitle) =>
        store.Add(Notification.ToStaff(NotificationKind.FeedbackReceived, innovationTitle, null, innovationId, Now));

    public void FeedbackReviewed(Guid authorId, Guid innovationId, string innovationTitle) =>
        store.Add(Notification.ToUser(authorId, NotificationKind.FeedbackReviewed, innovationTitle, null, innovationId, Now));

    private DateTime Now => clock.GetUtcNow().UtcDateTime;
}
