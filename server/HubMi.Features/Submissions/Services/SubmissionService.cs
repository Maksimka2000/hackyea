using HubMi.Domain.Accounts;
using HubMi.Domain.Submissions;
using HubMi.Features.Accounts;
using HubMi.Features.Common.Ports;
using HubMi.Features.Matching;
using HubMi.Features.Matching.Services;
using HubMi.Features.Matching.Validators;
using HubMi.Features.Notifications.Services;
using HubMi.Features.Submissions.Contracts;
using HubMi.Features.Submissions.Ports;
using HubMi.Features.Submissions.Validators;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace HubMi.Features.Submissions.Services;

public sealed record CreateSubmissionResult(CreatedSubmissionResponse? Created, Dictionary<string, string[]> Errors);

/// <summary>
/// The submitter's side: send a need, idea, good practice or local challenge, follow its status and talk to ROPS.
/// A new submission is matched against the library so it arrives already linked to related innovations.
/// </summary>
public sealed class SubmissionService(
    ISubmissionStore store,
    ISubmissionQueries queries,
    SubmissionViewBuilder views,
    MatchingService matching,
    Notifier notifier,
    IUnitOfWork unitOfWork,
    IOptions<MatchingOptions> matchingOptions,
    TimeProvider clock,
    ILogger<SubmissionService> logger)
{
    public async Task<CreateSubmissionResult> CreateAsync(
        CurrentUser user, ValidatedSubmission input, Guid? canvasId, CancellationToken cancellationToken)
    {
        if (input.Type == SubmissionType.LocalChallenge && user.Role != AccountRoles.Jst)
            return Invalid("type", "Wyzwanie lokalne zgłasza jednostka samorządu terytorialnego.");

        var details = input.Details;
        if (details.CategoryId is not null && !await views.CategoryExistsAsync(details.CategoryId, cancellationToken))
            return Invalid("categoryId", "Nieznana kategoria.");

        // Matching saves its own request log, so it runs before anything of this workflow is added to the unit of work.
        var match = await MatchAsync($"{details.Title}. {details.Description}", cancellationToken);
        if (details.CategoryId is null && match.CategoryId is not null)
            details = details with { CategoryId = match.CategoryId };

        var now = clock.GetUtcNow().UtcDateTime;
        var number = $"HM-{now.Year}-{await store.NextNumberAsync(cancellationToken):0000}";
        var submission = Submission.Create(number, user.Id, user.Role, input.Type, details, canvasId, now);

        var seen = await queries.GetInnovationsAsync(input.SeenInnovationIds, cancellationToken);
        submission.LinkInnovations(seen.Select(i => (i.Id, (int?)null)), LinkSource.Submitter);
        submission.LinkInnovations(match.Results, LinkSource.Match);

        store.Add(submission);
        notifier.SubmissionCreated(submission);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return new CreateSubmissionResult(new CreatedSubmissionResponse(submission.Id, submission.Number), []);
    }

    public async Task<IReadOnlyList<SubmissionSummaryResponse>> GetMineAsync(CurrentUser user, CancellationToken cancellationToken)
    {
        var rows = await queries.GetByAuthorAsync(user.Id, cancellationToken);
        var categories = await views.CategoriesAsync(cancellationToken);
        return rows
            .Select(r => new SubmissionSummaryResponse(
                r.Id, r.Number, r.Type, r.Title, r.Status,
                r.CategoryId is not null && categories.TryGetValue(r.CategoryId, out var c) ? c : null,
                r.CreatedAt, r.UpdatedAt, r.MessageCount))
            .ToList();
    }

    /// <summary>Null when it does not exist or belongs to someone else: the caller cannot tell the two apart.</summary>
    public async Task<SubmissionDetailsResponse?> GetMineAsync(CurrentUser user, Guid id, CancellationToken cancellationToken)
    {
        var submission = await queries.GetAsync(id, cancellationToken);
        return submission is null || submission.AuthorId != user.Id
            ? null
            : await views.BuildDetailsAsync(submission, forStaff: false, cancellationToken);
    }

    /// <summary>Null when not found or not the caller's. Throws a domain rule error when the submission is closed.</summary>
    public async Task<SubmissionDetailsResponse?> ReplyAsync(CurrentUser user, Guid id, string body, CancellationToken cancellationToken)
    {
        var submission = await store.FindForUpdateAsync(id, cancellationToken);
        if (submission is null || submission.AuthorId != user.Id)
            return null;

        submission.AddMessage(user.Id, user.Role, body, clock.GetUtcNow().UtcDateTime);
        notifier.SubmitterWrote(submission);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return await views.BuildDetailsAsync(submission, forStaff: false, cancellationToken);
    }

    private async Task<(string? CategoryId, List<(Guid, int?)> Results)> MatchAsync(string text, CancellationToken cancellationToken)
    {
        try
        {
            var max = matchingOptions.Value.MaxTextLength;
            var response = await matching.MatchAsync(
                new ValidatedMatchRequest(text.Length > max ? text[..max] : text, Dictated: false), clientKey: null, cancellationToken);
            return (response.Category?.Id, response.Results.Select(r => (r.InnovationId, (int?)r.Indicator.Percent)).ToList());
        }
        catch (Exception exception) when (exception is not OperationCanceledException)
        {
            // Linking is a convenience; a matching outage must not lose the submission.
            logger.LogWarning(exception, "Matching failed while linking a new submission; it is saved without links.");
            return (null, []);
        }
    }

    private static CreateSubmissionResult Invalid(string field, string message) =>
        new(null, new Dictionary<string, string[]> { [field] = [message] });
}
