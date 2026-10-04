using HubMi.Domain.Testing;
using HubMi.Features.Accounts;
using HubMi.Features.Accounts.Ports;
using HubMi.Features.Common.Ports;
using HubMi.Features.Innovations.Ports;
using HubMi.Features.Notifications.Services;
using HubMi.Features.Testing.Contracts;
using HubMi.Features.Testing.Ports;

namespace HubMi.Features.Testing.Services;

/// <summary>
/// The Innovation Tester: signed-in users rate published solutions, give feedback and propose improvements;
/// staff review the feedback. New feedback notifies staff.
/// </summary>
public sealed class InnovationTesterService(
    IRatingStore ratings,
    IFeedbackStore feedback,
    ITestingQueries queries,
    IInnovationDetailsReader innovations,
    IAccountDirectory accounts,
    Notifier notifier,
    IUnitOfWork unitOfWork,
    TimeProvider clock)
{
    public async Task<RatingSummaryResponse> GetSummaryAsync(Guid innovationId, CurrentUser? user, CancellationToken cancellationToken)
    {
        var summary = await queries.GetSummaryAsync(innovationId, cancellationToken);
        var mine = user is null ? null : await queries.GetStarsAsync(innovationId, user.Id, cancellationToken);
        return new RatingSummaryResponse(innovationId, summary.Average, summary.Count, summary.Distribution, mine);
    }

    /// <summary>Null when the card does not exist or is not published.</summary>
    public async Task<RatingSummaryResponse?> RateAsync(CurrentUser user, Guid innovationId, int stars, CancellationToken cancellationToken)
    {
        if (await innovations.GetByIdAsync(innovationId, cancellationToken) is null)
            return null;

        var now = clock.GetUtcNow().UtcDateTime;
        var rating = await ratings.FindForUpdateAsync(innovationId, user.Id, cancellationToken);
        if (rating is null)
            ratings.Add(InnovationRating.Create(innovationId, user.Id, stars, now));
        else
            rating.Rate(stars, now);

        await unitOfWork.SaveChangesAsync(cancellationToken);
        return await GetSummaryAsync(innovationId, user, cancellationToken);
    }

    /// <summary>Null when the card does not exist or is not published.</summary>
    public async Task<FeedbackResponse?> AddFeedbackAsync(
        CurrentUser user, Guid innovationId, FeedbackKind kind, string body, CancellationToken cancellationToken)
    {
        var card = await innovations.GetByIdAsync(innovationId, cancellationToken);
        if (card is null)
            return null;

        var item = InnovationFeedback.Create(innovationId, user.Id, kind, body, clock.GetUtcNow().UtcDateTime);
        feedback.Add(item);
        notifier.FeedbackReceived(innovationId, card.Innovation.Title);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return new FeedbackResponse(
            item.Id, innovationId, card.Innovation.Title, item.Kind, item.Body, item.Status, item.StaffNote, item.CreatedAt, item.ReviewedAt, null);
    }

    public async Task<IReadOnlyList<FeedbackResponse>> GetMineAsync(CurrentUser user, CancellationToken cancellationToken) =>
        (await queries.GetFeedbackByUserAsync(user.Id, cancellationToken)).Select(r => ToResponse(r, null)).ToList();

    public async Task<IReadOnlyList<FeedbackResponse>> GetForStaffAsync(
        FeedbackKind? kind, FeedbackStatus? status, CancellationToken cancellationToken)
    {
        var rows = await queries.GetFeedbackAsync(kind, status, cancellationToken);
        var people = await accounts.FindManyAsync(rows.Select(r => r.UserId).Distinct().ToList(), cancellationToken);
        return rows.Select(r => ToResponse(r, people.TryGetValue(r.UserId, out var a) ? a.DisplayName : null)).ToList();
    }

    public async Task<bool> ReviewAsync(Guid id, FeedbackStatus status, string? staffNote, CancellationToken cancellationToken)
    {
        var item = await feedback.FindForUpdateAsync(id, cancellationToken);
        if (item is null)
            return false;

        item.Review(status, staffNote, clock.GetUtcNow().UtcDateTime);
        var title = await queries.GetInnovationTitleAsync(item.InnovationId, cancellationToken) ?? "—";
        notifier.FeedbackReviewed(item.UserId, item.InnovationId, title);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<IReadOnlyList<RatedInnovationResponse>> GetRatingOverviewAsync(CancellationToken cancellationToken) =>
        (await queries.GetRatingOverviewAsync(cancellationToken))
        .Select(r => new RatedInnovationResponse(r.InnovationId, r.Title, r.Average, r.RatingCount, r.NewFeedbackCount))
        .ToList();

    private static FeedbackResponse ToResponse(FeedbackRow r, string? authorName) =>
        new(r.Id, r.InnovationId, r.InnovationTitle, r.Kind, r.Body, r.Status, r.StaffNote, r.CreatedAt, r.ReviewedAt, authorName);
}
