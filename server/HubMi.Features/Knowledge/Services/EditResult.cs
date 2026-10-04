namespace HubMi.Features.Knowledge.Services;

/// <summary>The outcome of a staff edit: done, the item does not exist, or the input has field errors.</summary>
public sealed record EditResult(bool Found, Dictionary<string, string[]> Errors)
{
    public static readonly EditResult Done = new(true, []);
    public static readonly EditResult NotFound = new(false, []);

    public bool Succeeded => Found && Errors.Count == 0;

    public static EditResult Invalid(string field, string message) => new(true, new() { [field] = [message] });
}

public enum PublicationAction
{
    Verify,
    Publish,
    Unpublish
}
