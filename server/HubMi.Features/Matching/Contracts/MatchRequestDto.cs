namespace HubMi.Features.Matching.Contracts;

public sealed class MatchRequestDto
{
    /// <summary>The problem in the user's own words, or just keywords.</summary>
    public string? Text { get; init; }

    /// <summary><c>typed</c> (default) or <c>dictated</c>. Informational only.</summary>
    public string? InputMode { get; init; }
}
