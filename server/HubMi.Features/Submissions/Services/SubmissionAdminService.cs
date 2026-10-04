using HubMi.Domain.Innovations;
using HubMi.Domain.Submissions;
using HubMi.Features.Accounts;
using HubMi.Features.Accounts.Ports;
using HubMi.Features.Common.Ports;
using HubMi.Features.Knowledge.Services;
using HubMi.Features.Notifications.Services;
using HubMi.Features.Submissions.Contracts;
using HubMi.Features.Submissions.Ports;
using HubMi.Features.Submissions.Validators;

namespace HubMi.Features.Submissions.Services;

public sealed record AdminActionResult(bool Found, Dictionary<string, string[]> Errors, SubmissionDetailsResponse? Details = null)
{
    public static readonly AdminActionResult NotFound = new(false, []);

    public static AdminActionResult Invalid(string field, string message) => new(true, new() { [field] = [message] });
}

/// <summary>
/// The ROPS staff side: monitor and moderate incoming submissions, reply, move them through the statuses,
/// link innovations and turn a good idea into a draft library card. Every change the submitter should know about notifies them.
/// </summary>
public sealed class SubmissionAdminService(
    ISubmissionStore store,
    ISubmissionQueries queries,
    SubmissionViewBuilder views,
    IAccountDirectory accounts,
    InnovationEditingService innovations,
    SubmissionValidator validator,
    Notifier notifier,
    IUnitOfWork unitOfWork,
    TimeProvider clock)
{
    public const int MaxPageSize = 100;

    public async Task<PagedResponse<AdminSubmissionRowResponse>> SearchAsync(SubmissionFilter filter, CancellationToken cancellationToken)
    {
        var (rows, total) = await queries.SearchAsync(filter, cancellationToken);
        var categories = await views.CategoriesAsync(cancellationToken);
        var authors = await accounts.FindManyAsync(rows.Select(r => r.AuthorId).Distinct().ToList(), cancellationToken);

        var items = rows
            .Select(r => new AdminSubmissionRowResponse(
                r.Id,
                r.Number,
                r.Type,
                r.Title,
                r.Status,
                r.CategoryId is not null && categories.TryGetValue(r.CategoryId, out var c) ? c : null,
                authors.TryGetValue(r.AuthorId, out var a) ? a.DisplayName : "—",
                r.AuthorRole,
                r.CreatedAt,
                r.SeenByAdminAt is not null,
                r.FirstResponseAt,
                r.FirstResponseAt is { } answered ? Math.Round((answered - r.CreatedAt).TotalHours, 1) : null,
                r.MessageCount))
            .ToList();

        return new PagedResponse<AdminSubmissionRowResponse>(items, total, filter.Page, filter.PageSize);
    }

    /// <summary>Opening a submission marks it seen by staff (and moves a fresh one to "in review", which notifies the submitter).</summary>
    public async Task<SubmissionDetailsResponse?> OpenAsync(CurrentUser staff, Guid id, CancellationToken cancellationToken)
    {
        var submission = await store.FindForUpdateAsync(id, cancellationToken);
        if (submission is null)
            return null;

        if (submission.SeenByAdminAt is null)
        {
            var before = submission.Status;
            submission.MarkSeenByAdmin(staff.Id, Now);
            if (submission.Status != before)
                notifier.StatusChanged(submission);
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }

        return await views.BuildDetailsAsync(submission, forStaff: true, cancellationToken);
    }

    public Task<AdminActionResult> ReplyAsync(CurrentUser staff, Guid id, string body, CancellationToken cancellationToken) =>
        ChangeAsync(id, submission =>
        {
            submission.AddMessage(staff.Id, staff.Role, body, Now);
            notifier.StaffReplied(submission);
            return null;
        }, cancellationToken);

    public Task<AdminActionResult> ChangeStatusAsync(
        CurrentUser staff, Guid id, SubmissionStatus status, string? note, CancellationToken cancellationToken) =>
        ChangeAsync(id, submission =>
        {
            if (submission.ChangeStatus(status, staff.Id, note, Now))
                notifier.StatusChanged(submission);
            return null;
        }, cancellationToken);

    public Task<AdminActionResult> RejectAsync(CurrentUser staff, Guid id, string reason, CancellationToken cancellationToken) =>
        ChangeAsync(id, submission =>
        {
            submission.Reject(reason, staff.Id, Now);
            notifier.StatusChanged(submission);
            return null;
        }, cancellationToken);

    /// <summary>Which fields are required depends on the submission's type, so validation happens once it is loaded.</summary>
    public async Task<AdminActionResult> ModerateAsync(Guid id, ModerateSubmissionRequest request, CancellationToken cancellationToken)
    {
        var categories = await views.CategoriesAsync(cancellationToken);
        return await ChangeAsync(id, submission =>
        {
            if (!validator.TryValidateModeration(submission.Type, request, out var details, out var errors))
                return new AdminActionResult(true, errors);
            if (details!.CategoryId is not null && !categories.ContainsKey(details.CategoryId.Trim()))
                return AdminActionResult.Invalid("categoryId", "Nieznana kategoria.");

            submission.Moderate(details, Now);
            return null;
        }, cancellationToken);
    }

    public async Task<AdminActionResult> ReplaceLinksAsync(Guid id, IReadOnlyCollection<Guid> innovationIds, CancellationToken cancellationToken)
    {
        var known = (await queries.GetInnovationsAsync(innovationIds, cancellationToken)).Select(i => i.Id).ToList();
        if (known.Count != innovationIds.Distinct().Count())
            return AdminActionResult.Invalid("innovationIds", "Część wskazanych innowacji nie istnieje.");

        return await ChangeAsync(id, submission =>
        {
            submission.ReplaceLinks(known, Now);
            return null;
        }, cancellationToken);
    }

    /// <summary>
    /// Turns an idea or good practice into a draft library card (staff then edit, verify and publish it) and links it back.
    /// The submitter's personal data never goes into the card; only the text they wrote for publication does.
    /// </summary>
    public async Task<(Guid? InnovationId, AdminActionResult Result)> PublishAsInnovationAsync(Guid id, CancellationToken cancellationToken)
    {
        var submission = await store.FindForUpdateAsync(id, cancellationToken);
        if (submission is null)
            return (null, AdminActionResult.NotFound);
        if (submission.Type is not (SubmissionType.Idea or SubmissionType.GoodPractice))
            return (null, AdminActionResult.Invalid("type", "Kartę innowacji można utworzyć z pomysłu albo dobrej praktyki."));
        if (submission.CategoryId is null)
            return (null, AdminActionResult.Invalid("categoryId", "Najpierw przypisz zgłoszeniu kategorię."));

        var innovationId = Guid.NewGuid();
        innovations.AddDraft(innovationId, new InnovationContent(
            submission.CategoryId,
            submission.Title,
            Tagline: null,
            Solution: submission.Description,
            Problems: null,
            TargetGroup: submission.TargetGroup,
            Beneficiaries: null,
            Evidence: submission.Results,
            SourceUrl: innovations.OwnSourceUrl(innovationId),
            VideoUrl: null,
            MaterialsUrl: null,
            DetailsPdfUrl: null,
            LicenseUrl: innovations.DefaultLicenseUrl,
            DisseminationBadge: null));

        submission.LinkInnovations([(innovationId, null)], LinkSource.Admin);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return (innovationId, new AdminActionResult(true, []));
    }

    public async Task<ResponseTimeResponse> GetResponseTimeAsync(DateTime? from, DateTime? to, CancellationToken cancellationToken)
    {
        var s = await queries.GetResponseTimeAsync(from, to, cancellationToken);
        return new ResponseTimeResponse(s.AverageHours, s.MedianHours, s.AnsweredCount, s.WaitingCount, s.OldestWaitingSince, s.UnseenCount);
    }

    private DateTime Now => clock.GetUtcNow().UtcDateTime;

    private async Task<AdminActionResult> ChangeAsync(
        Guid id, Func<Submission, AdminActionResult?> change, CancellationToken cancellationToken)
    {
        var submission = await store.FindForUpdateAsync(id, cancellationToken);
        if (submission is null)
            return AdminActionResult.NotFound;

        if (change(submission) is { } refused)
            return refused;

        await unitOfWork.SaveChangesAsync(cancellationToken);
        return new AdminActionResult(true, [], await views.BuildDetailsAsync(submission, forStaff: true, cancellationToken));
    }
}
