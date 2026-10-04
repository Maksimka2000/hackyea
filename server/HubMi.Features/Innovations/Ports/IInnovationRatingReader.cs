namespace HubMi.Features.Innovations.Ports;

public sealed record InnovationRatingAverage(double Average, int Count);

/// <summary>Star ratings from the Innovation Tester, shown on cards. Cards nobody rated are absent from the result.</summary>
public interface IInnovationRatingReader
{
    Task<IReadOnlyDictionary<Guid, InnovationRatingAverage>> GetAsync(IReadOnlyCollection<Guid> innovationIds, CancellationToken cancellationToken);
}
