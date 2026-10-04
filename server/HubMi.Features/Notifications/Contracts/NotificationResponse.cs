using HubMi.Domain.Notifications;

namespace HubMi.Features.Notifications.Contracts;

public sealed record NotificationResponse(
    Guid Id,
    NotificationKind Kind,
    string Summary,
    Guid? SubmissionId,
    Guid? InnovationId,
    DateTime CreatedAt,
    DateTime? ReadAt);

public sealed record UnreadCountResponse(int Count);
