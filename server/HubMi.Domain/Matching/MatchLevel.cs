namespace HubMi.Domain.Matching;

/// <summary>How strongly a card matches the problem text. Derived from the match percentage.</summary>
public enum MatchLevel
{
    Weak = 0,
    Partial = 1,
    Good = 2
}
