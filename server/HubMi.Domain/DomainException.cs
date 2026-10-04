namespace HubMi.Domain;

/// <summary>A business rule refused the change, e.g. publishing an unverified card. The API answers 400 with the message.</summary>
public sealed class DomainException(string message, string? field = null) : Exception(message)
{
    /// <summary>The input field the rule is about, when there is one.</summary>
    public string? Field { get; } = field;
}
