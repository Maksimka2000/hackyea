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
    MatchIndicatorDto Indicator,
    string Reason,
    string? TargetGroup,
    bool HasEvidence,
    string Evidence,
    string? VideoUrl,
    string SourceUrl,
    string CardUrl);

public sealed record MatchIndicatorDto(
    int Percent,
    string Level,
    string Label,
    IReadOnlyList<string> MatchedWords,
    IReadOnlyList<string> MatchedIn,
    IReadOnlyList<string> MissingWords);
