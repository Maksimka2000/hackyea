using HubMi.Features.Accounts;
using HubMi.Features.Notifications.Contracts;
using HubMi.Features.Notifications.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HubMi.Features.Notifications.Controllers;

/// <summary>In-app notices for the signed-in user (staff share one inbox). The web app polls <c>unread-count</c>.</summary>
[ApiController]
[Authorize]
[Route("api/notifications")]
public sealed class NotificationsController(NotificationService notifications) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<NotificationResponse>>(StatusCodes.Status200OK)]
    public Task<IReadOnlyList<NotificationResponse>> GetAll([FromQuery] bool unreadOnly, CancellationToken cancellationToken) =>
        notifications.GetAsync(User.GetCurrentUser(), unreadOnly, cancellationToken);

    [HttpGet("unread-count")]
    [ProducesResponseType<UnreadCountResponse>(StatusCodes.Status200OK)]
    public async Task<UnreadCountResponse> UnreadCount(CancellationToken cancellationToken) =>
        new(await notifications.CountUnreadAsync(User.GetCurrentUser(), cancellationToken));

    [HttpPost("{id:guid}/read")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> MarkRead(Guid id, CancellationToken cancellationToken) =>
        await notifications.MarkReadAsync(User.GetCurrentUser(), id, cancellationToken) ? NoContent() : NotFound();

    [HttpPost("read-all")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> MarkAllRead(CancellationToken cancellationToken)
    {
        await notifications.MarkAllReadAsync(User.GetCurrentUser(), cancellationToken);
        return NoContent();
    }
}
