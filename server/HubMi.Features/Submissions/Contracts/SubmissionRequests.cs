namespace HubMi.Features.Submissions.Contracts;

/// <summary>
/// A new submission. <c>type</c>: need, idea, goodPractice or localChallenge (JST only). An idea needs targetGroup and stage;
/// a good practice needs targetGroup and results. <c>seenInnovationIds</c> are the cards the user saw on search before submitting.
/// </summary>
public sealed class CreateSubmissionRequest
{
    public string? Type { get; init; }
    public string? Title { get; init; }
    public string? Description { get; init; }
    public string? CategoryId { get; init; }
    public string? Place { get; init; }
    public string? TargetGroup { get; init; }
    public string? Stage { get; init; }
    public string? PilotScale { get; init; }
    public string? Results { get; init; }
    public IReadOnlyList<Guid>? SeenInnovationIds { get; init; }
}

public sealed class AddMessageRequest
{
    public string? Body { get; init; }
}

public sealed class ChangeStatusRequest
{
    /// <summary>inReview, answered or closed. Rejecting goes through moderation, with a reason.</summary>
    public string? Status { get; init; }

    public string? Note { get; init; }
}

/// <summary>Staff edit of the submitter's text. With <c>rejectReason</c> set, the submission is rejected instead (text is left as is).</summary>
public sealed class ModerateSubmissionRequest
{
    public string? Title { get; init; }
    public string? Description { get; init; }
    public string? CategoryId { get; init; }
    public string? Place { get; init; }
    public string? TargetGroup { get; init; }
    public string? Stage { get; init; }
    public string? PilotScale { get; init; }
    public string? Results { get; init; }
    public string? RejectReason { get; init; }
}

public sealed class ReplaceLinksRequest
{
    public IReadOnlyList<Guid>? InnovationIds { get; init; }
}
