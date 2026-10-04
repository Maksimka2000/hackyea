using HubMi.Domain.Innovations;
using HubMi.Domain.Knowledge;
using HubMi.Features.Knowledge.Ports;
using Microsoft.EntityFrameworkCore;

namespace HubMi.Infrastructure.Persistence.Repositories;

internal sealed class InnovationEditor(HubMiDbContext db) : IInnovationEditor
{
    public void Add(Innovation innovation) => db.Innovations.Add(innovation);

    public void Remove(Innovation innovation) => db.Innovations.Remove(innovation);

    public Task<Innovation?> FindForUpdateAsync(Guid id, CancellationToken cancellationToken) =>
        db.Innovations.FirstOrDefaultAsync(i => i.Id == id, cancellationToken);
}

internal sealed class ChallengeStore(HubMiDbContext db) : IChallengeStore
{
    public void Add(Challenge challenge) => db.Challenges.Add(challenge);

    public void Remove(Challenge challenge) => db.Challenges.Remove(challenge);

    public Task<Challenge?> FindForUpdateAsync(Guid id, CancellationToken cancellationToken) =>
        db.Challenges.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
}

internal sealed class MaterialStore(HubMiDbContext db) : IMaterialStore
{
    public void Add(Material material) => db.Materials.Add(material);

    public void Remove(Material material) => db.Materials.Remove(material);

    public Task<Material?> FindForUpdateAsync(Guid id, CancellationToken cancellationToken) =>
        db.Materials.FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
}

internal sealed class KnowledgeQueries(HubMiDbContext db) : IKnowledgeQueries
{
    public async Task<IReadOnlyList<InnovationAdminRow>> GetInnovationsAsync(
        PublicationStatus? status, string? categoryId, string? query, CancellationToken cancellationToken)
    {
        var cards = db.Innovations.AsNoTracking();
        if (status is { } s)
            cards = cards.Where(i => i.Status == s);
        if (!string.IsNullOrWhiteSpace(categoryId))
            cards = cards.Where(i => i.CategoryId == categoryId);
        if (!string.IsNullOrWhiteSpace(query))
        {
            var pattern = $"%{query.Trim().Replace("\\", "\\\\").Replace("%", "\\%").Replace("_", "\\_")}%";
            cards = cards.Where(i => EF.Functions.ILike(i.Title, pattern));
        }

        return await cards
            .OrderByDescending(i => i.UpdatedAt)
            .Select(i => new InnovationAdminRow(
                i.Id,
                i.Title,
                i.CategoryId,
                i.Status,
                i.UpdatedAt,
                db.InnovationRatings.Where(r => r.InnovationId == i.Id).Average(r => (double?)r.Stars),
                db.InnovationRatings.Count(r => r.InnovationId == i.Id)))
            .ToListAsync(cancellationToken);
    }

    public Task<Innovation?> GetInnovationAsync(Guid id, CancellationToken cancellationToken) =>
        db.Innovations.AsNoTracking().FirstOrDefaultAsync(i => i.Id == id, cancellationToken);

    public async Task<IReadOnlyList<Challenge>> GetChallengesAsync(bool publishedOnly, CancellationToken cancellationToken) =>
        await db.Challenges.AsNoTracking()
            .Where(c => !publishedOnly || c.Status == PublicationStatus.Published)
            .OrderBy(c => c.Title)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Material>> GetMaterialsAsync(bool publishedOnly, CancellationToken cancellationToken) =>
        await db.Materials.AsNoTracking()
            .Where(m => !publishedOnly || m.Status == PublicationStatus.Published)
            .OrderByDescending(m => m.UpdatedAt)
            .ToListAsync(cancellationToken);
}
