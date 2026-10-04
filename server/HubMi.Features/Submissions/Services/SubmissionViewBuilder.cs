using HubMi.Domain.Accounts;
using HubMi.Domain.Submissions;
using HubMi.Features.Accounts.Ports;
using HubMi.Features.Matching.Ports;
using HubMi.Features.Submissions.Contracts;
using HubMi.Features.Submissions.Ports;

namespace HubMi.Features.Submissions.Services;

/// <summary>Builds the response shapes shared by the submitter and staff views: names, categories and linked card titles.</summary>
public sealed class SubmissionViewBuilder(
    ISubmissionQueries queries,
    IAccountDirectory accounts,
    IInnovationCategoryReader categories)
{
    public const string StaffFallbackName = "Zespół ROPS";

    public async Task<SubmissionDetailsResponse> BuildDetailsAsync(Submission s, bool forStaff, CancellationToken cancellationToken)
    {
        var people = await accounts.FindManyAsync(
            s.Messages.Select(m => m.AuthorId).Append(s.AuthorId).Distinct().ToList(), cancellationToken);
        var innovations = (await queries.GetInnovationsAsync(s.Links.Select(l => l.InnovationId).ToList(), cancellationToken))
            .ToDictionary(i => i.Id);
        var category = await CategoryAsync(s.CategoryId, cancellationToken);

        var messages = s.Messages
            .OrderBy(m => m.CreatedAt)
            .Select(m =>
            {
                var fromStaff = m.AuthorRole == AccountRoles.Admin;
                var name = people.TryGetValue(m.AuthorId, out var person) ? person.DisplayName : null;
                return new MessageResponse(m.Id, fromStaff, name ?? (fromStaff ? StaffFallbackName : "—"), m.Body, m.CreatedAt);
            })
            .ToList();

        var links = s.Links
            .Where(l => innovations.ContainsKey(l.InnovationId))
            .OrderBy(l => l.Source).ThenByDescending(l => l.Score)
            .Select(l => new LinkedInnovationResponse(l.InnovationId, innovations[l.InnovationId].Title, l.Source, l.Score))
            .ToList();

        var timeline = s.StatusChanges
            .OrderBy(c => c.ChangedAt)
            .Select(c => new StatusStepResponse(c.From, c.To, c.ChangedAt, c.Note))
            .ToList();

        AuthorResponse? author = null;
        if (forStaff && people.TryGetValue(s.AuthorId, out var a))
            author = new AuthorResponse(a.Id, a.DisplayName, a.Role, a.OrganizationName, a.Municipality);

        return new SubmissionDetailsResponse(
            s.Id, s.Number, s.Type, s.Title, s.Description, category, s.Place, s.TargetGroup, s.Stage, s.PilotScale, s.Results,
            s.Status, s.RejectionReason, s.CreatedAt, s.UpdatedAt, s.FirstResponseAt, s.CanvasId, timeline, messages, links, author);
    }

    public async Task<IReadOnlyDictionary<string, CategoryRef>> CategoriesAsync(CancellationToken cancellationToken) =>
        (await categories.GetAllAsync(cancellationToken)).ToDictionary(c => c.Id, c => new CategoryRef(c.Id, c.Name));

    public async Task<bool> CategoryExistsAsync(string categoryId, CancellationToken cancellationToken) =>
        (await CategoriesAsync(cancellationToken)).ContainsKey(categoryId.Trim());

    private async Task<CategoryRef?> CategoryAsync(string? id, CancellationToken cancellationToken) =>
        id is not null && (await CategoriesAsync(cancellationToken)).TryGetValue(id, out var category) ? category : null;
}
