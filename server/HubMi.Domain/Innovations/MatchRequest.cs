namespace HubMi.Domain.Innovations;

/// <summary>A logged matching request. Holds no personal data: the client key is a one-way hash.</summary>
public sealed class MatchRequest
{
    private readonly List<MatchRequestResult> _results = [];

    private MatchRequest()
    {
    }

    public Guid Id { get; private set; }
    public string Text { get; private set; } = null!;
    public bool Dictated { get; private set; }
    public DateTime ReceivedAt { get; private set; }
    public string? ResolvedCategoryId { get; private set; }
    public int TopPercent { get; private set; }
    public MatchConfidence Confidence { get; private set; }
    public string? ClientKey { get; private set; }
    public IReadOnlyList<MatchRequestResult> Results => _results;

    public static MatchRequest Create(
        string text,
        bool dictated,
        DateTime receivedAt,
        string? resolvedCategoryId,
        int topPercent,
        MatchConfidence confidence,
        string? clientKey)
    {
        if (string.IsNullOrWhiteSpace(text))
            throw new ArgumentException("Text is required.", nameof(text));
        if (topPercent is < 0 or > 100)
            throw new ArgumentOutOfRangeException(nameof(topPercent));

        return new MatchRequest
        {
            Id = Guid.NewGuid(),
            Text = text,
            Dictated = dictated,
            ReceivedAt = receivedAt,
            ResolvedCategoryId = resolvedCategoryId,
            TopPercent = topPercent,
            Confidence = confidence,
            ClientKey = clientKey
        };
    }

    public void AddResult(string innovationId, int rank, int percent, MatchLevel level)
    {
        if (rank < 1)
            throw new ArgumentOutOfRangeException(nameof(rank));
        if (percent is < 0 or > 100)
            throw new ArgumentOutOfRangeException(nameof(percent));

        _results.Add(MatchRequestResult.Create(Id, innovationId, rank, percent, level));
    }
}
