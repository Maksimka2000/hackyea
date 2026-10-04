using System.ComponentModel.DataAnnotations;

namespace HubMi.Features.Matching;

/// <summary>Tunable matching settings. Stop words and thresholds live in configuration (search-config.json) so they can be tuned without a deploy.</summary>
public sealed class MatchingOptions
{
    public const string SectionName = "Matching";

    [Range(1, 100)] public int MinTextLength { get; set; } = 3;
    [Range(10, 5000)] public int MaxTextLength { get; set; } = 1000;

    /// <summary>Words are cut to this many letters and matched as prefixes; used to explain a match and by the keyword fallback.</summary>
    [Range(3, 10)] public int PrefixLength { get; set; } = 5;
    [Range(1, 10)] public int MinTokenLength { get; set; } = 3;
    [Range(1, 50)] public int MaxQueryTerms { get; set; } = 12;

    /// <summary>Candidates of the keyword fallback.</summary>
    [Range(3, 200)] public int CandidateLimit { get; set; } = 30;

    /// <summary>How many cards the vector search proposes (best row of each card).</summary>
    [Range(3, 200)] public int RetrievalLimit { get; set; } = 20;

    /// <summary>How many of the proposed cards the reranker reads; it is the slow step, so keep this small.</summary>
    [Range(1, 50)] public int RerankCandidates { get; set; } = 10;

    /// <summary>The most cards returned (best first).</summary>
    [Range(1, 10)] public int ResultCount { get; set; } = 3;
    [Range(1, 50)] public int CategoryTopN { get; set; } = 10;
    [Range(0.1, 1.0)] public double AlsoRelatedRatio { get; set; } = 0.7;
    [Range(0, 5)] public int MaxAlsoRelated { get; set; } = 2;

    [Range(0.0, 1.0)] public double PrimaryFieldWeight { get; set; } = 1.0;
    [Range(0.0, 1.0)] public double SecondaryFieldWeight { get; set; } = 0.8;
    [Range(0.0, 1.0)] public double TertiaryFieldWeight { get; set; } = 0.5;
    [Range(0.0, 1.0)] public double LengthNormalization { get; set; } = 0.1;

    /// <summary>
    /// F: when even the best card's best row is less similar than this to the query, nothing is returned and the reranker is not run.
    /// Calibrate on the evaluation set.
    /// </summary>
    [Range(0.0, 1.0)] public double RetrievalFloor { get; set; } = 0.40;

    /// <summary>The floor that replaces <see cref="RetrievalFloor"/> when the reranker is unavailable: vector similarity alone is less reliable.</summary>
    [Range(0.0, 1.0)] public double RetrievalOnlyFloor { get; set; } = 0.55;

    /// <summary>
    /// T: reranker score (a probability, 0-1) a card needs to be returned. bge-reranker-v2-m3 is strict with everyday wording, so
    /// useful matches often score far below 0.5; calibrate on the evaluation set. A wrong card is worse than none, so favour precision.
    /// </summary>
    [Range(0.0, 1.0)] public double RerankThreshold { get; set; } = 0.005;

    /// <summary>Reranker score at or above which a card counts as a 100 % match. Between T (0 %) and this score the percentage grows with the model's logit.</summary>
    [Range(0.0, 1.0)] public double RerankCeiling { get; set; } = 0.9;

    /// <summary>Vector similarity counted as a 100 % match when the reranker is unavailable (the floor counts as 0 %).</summary>
    [Range(0.0, 1.0)] public double RetrievalOnlyCeiling { get; set; } = 0.75;

    /// <summary>How long an identical question is answered from memory (0 turns the cache off). Edited cards reset it.</summary>
    [Range(0, 86400)] public int CacheSeconds { get; set; } = 3600;

    /// <summary>Thresholds on the match percentage (the reranker score times 100); the reranker score between T (0 %) and the ceiling (100 %).</summary>
    [Range(0, 100)] public int GoodThreshold { get; set; } = 60;
    [Range(0, 100)] public int PartialThreshold { get; set; } = 30;

    [Range(50, 2000)] public int EvidenceMaxLength { get; set; } = 300;
    public string CardUrlTemplate { get; set; } = "/biblioteka/{0}";

    /// <summary>Mixed into the one-way hash of the client address that keys the rate limit and request log.</summary>
    public string ClientKeySalt { get; set; } = string.Empty;

    public List<string> StopWords { get; set; } = [];
}
