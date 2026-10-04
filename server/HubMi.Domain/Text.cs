namespace HubMi.Domain;

/// <summary>Shared trimming rules for user-entered text, so every entity stores the same clean form.</summary>
internal static class Text
{
    public static string Required(string? value, string name)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new DomainException($"Pole {name} jest wymagane.", name);
        return value.Trim();
    }

    public static string? Optional(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
