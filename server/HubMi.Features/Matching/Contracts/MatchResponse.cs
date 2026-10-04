namespace HubMi.Features.Matching.Contracts;

public sealed record MatchResponse(
    string Confidence,
    string Text,
    IReadOnlyList<string> RecognizedTerms,
    CategoryMatchDto? Category,
    IReadOnlyList<MatchResultDto> Results);

public sealed record CategoryMatchDto(
    string Id,
    string Name,
    int SharePercent,
    IReadOnlyList<CategoryRefDto> AlsoRelated);

public sealed record CategoryRefDto(string Id, string Name);

public sealed record MatchResultDto(
    int Rank,
    Guid InnovationId,
    string Title,
    string? Tagline,
    CategoryRefDto Category,
    MatchIndicatorDto Indicator,
    string Reason,
    string? TargetGroup,
    bool HasEvidence,
    string Evidence,
    string? VideoUrl,
    string SourceUrl,
    string CardUrl,
    WhyDto Why);

/// <summary>
/// Why a card matched: a sentence cut from the card's own text (<see cref="Excerpt"/>) with the user's words marked.
/// <see cref="Field"/> is "problem" or "solution". <see cref="ByMeaning"/> is true when the card shares no word with the user's text
/// and matched by meaning only (nothing is marked then).
/// </summary>
public sealed record WhyDto(string Field, string Excerpt, IReadOnlyList<HighlightDto> Highlights, bool ByMeaning);

/// <summary>A marked word: its start and length as UTF-16 positions in <see cref="WhyDto.Excerpt"/>.</summary>
public sealed record HighlightDto(int Start, int Length);

public sealed record MatchIndicatorDto(
    int Percent,
    string Level,
    string Label,
    IReadOnlyList<string> MatchedWords,
    IReadOnlyList<string> MatchedIn,
    IReadOnlyList<string> MissingWords);
