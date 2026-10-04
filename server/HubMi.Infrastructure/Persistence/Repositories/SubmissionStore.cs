using HubMi.Domain.Submissions;
using HubMi.Features.Submissions.Ports;
using HubMi.Infrastructure.Persistence.Configurations;
using Microsoft.EntityFrameworkCore;

namespace HubMi.Infrastructure.Persistence.Repositories;

internal sealed class SubmissionStore(HubMiDbContext db) : ISubmissionStore
{
    public async Task<long> NextNumberAsync(CancellationToken cancellationToken) =>
        await db.Database
            .SqlQueryRaw<long>($"SELECT nextval('{SubmissionConfiguration.NumberSequence}') AS \"Value\"")
            .SingleAsync(cancellationToken);

    public void Add(Submission submission) => db.Submissions.Add(submission);

    public Task<Submission?> FindForUpdateAsync(Guid id, CancellationToken cancellationToken) =>
        db.Submissions
            .Include(s => s.Messages)
            .Include(s => s.StatusChanges)
            .Include(s => s.Links)
            .AsSplitQuery()
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
}
