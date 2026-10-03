using System.ComponentModel.DataAnnotations;

namespace HubMi.Features.Matching;

/// <summary>Tunable matching settings. Word lists and thresholds live in configuration (search-config.json) so they can be tuned without a deploy.</summary>
public sealed class MatchingOptions
{
    public const string SectionName = "Matching";

    [Range(1, 100)] public int MinTextLength { get; set; } = 3;
    [Range(10, 5000)] public int MaxTextLength { get; set; } = 1000;

    /// <summary>Words are cut to this many letters and matched as prefixes; this stands in for a Polish stemmer.</summary>
    [Range(3, 10)] public int PrefixLength { get; set; } = 5;
    [Range(1, 10)] public int MinTokenLength { get; set; } = 3;
    [Range(1, 50)] public int MaxQueryTerms { get; set; } = 12;
    [Range(0, 50)] public int MaxExpansionTerms { get; set; } = 10;

    [Range(3, 200)] public int CandidateLimit { get; set; } = 30;
    [Range(1, 10)] public int ResultCount { get; set; } = 3;
    [Range(1, 50)] public int CategoryTopN { get; set; } = 10;
    [Range(0.1, 1.0)] public double AlsoRelatedRatio { get; set; } = 0.7;
    [Range(0, 5)] public int MaxAlsoRelated { get; set; } = 2;

    [Range(0.0, 1.0)] public double SynonymWeight { get; set; } = 0.7;
    [Range(0.0, 1.0)] public double PrimaryFieldWeight { get; set; } = 1.0;
    [Range(0.0, 1.0)] public double SecondaryFieldWeight { get; set; } = 0.8;
    [Range(0.0, 1.0)] public double TertiaryFieldWeight { get; set; } = 0.5;
    [Range(0.0, 1.0)] public double LengthNormalization { get; set; } = 0.1;

    [Range(0, 100)] public int GoodThreshold { get; set; } = 60;
    [Range(0, 100)] public int PartialThreshold { get; set; } = 30;

    [Range(50, 2000)] public int EvidenceMaxLength { get; set; } = 300;
    public string CardUrlTemplate { get; set; } = "/biblioteka/{0}";

    /// <summary>Mixed into the one-way hash of the client address that keys the rate limit and request log.</summary>
    public string ClientKeySalt { get; set; } = string.Empty;

    public List<string> StopWords { get; set; } = [];
    public Dictionary<string, string[]> Synonyms { get; set; } = [];
    public Dictionary<string, string> IrregularForms { get; set; } = [];
}
