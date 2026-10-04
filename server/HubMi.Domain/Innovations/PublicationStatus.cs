namespace HubMi.Domain.Innovations;

/// <summary>Editorial state of knowledge content: staff draft it, verify the facts, then publish it to the public.</summary>
public enum PublicationStatus
{
    Draft,
    Verified,
    Published
}
