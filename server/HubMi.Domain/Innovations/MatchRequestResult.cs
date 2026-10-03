namespace HubMi.Domain.Innovations;

/// <summary>One innovation suggested for a <see cref="MatchRequest"/>. Used for "most suggested" trends.</summary>
public sealed class MatchRequestResult
{
    private MatchRequestResult()
    {
    }

    public Guid MatchRequestId { get; private set; }
    public string InnovationId { get; private set; } = null!;
    public int Rank { get; private set; }
    public int Percent { get; private set; }
    public MatchLevel Level { get; private set; }

    internal static MatchRequestResult Create(Guid matchRequestId, string innovationId, int rank, int percent, MatchLevel level) =>
        new()
        {
            MatchRequestId = matchRequestId,
            InnovationId = innovationId,
            Rank = rank,
            Percent = percent,
            Level = level
        };
}
