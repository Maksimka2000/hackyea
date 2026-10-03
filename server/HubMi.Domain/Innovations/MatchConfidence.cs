namespace HubMi.Domain.Innovations;

/// <summary>Overall confidence of one matching request: low when even the best card is a weak match.</summary>
public enum MatchConfidence
{
    Ok = 0,
    Low = 1
}
