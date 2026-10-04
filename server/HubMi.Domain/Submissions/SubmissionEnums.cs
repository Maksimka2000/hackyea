namespace HubMi.Domain.Submissions;

public enum SubmissionType
{
    /// <summary>A problem or need with no fitting innovation yet.</summary>
    Need,

    /// <summary>An idea card: essence, target group, stage.</summary>
    Idea,

    /// <summary>A good practice or a micro-scale pilot that already ran.</summary>
    GoodPractice,

    /// <summary>A local challenge reported by a local government (JST).</summary>
    LocalChallenge
}

/// <summary>What the submitter sees: sent, in review, answered; closed or rejected at the end.</summary>
public enum SubmissionStatus
{
    Received,
    InReview,
    Answered,
    Closed,
    Rejected
}

public enum IdeaStage
{
    Idea,
    SmallPilot,
    Working
}

/// <summary>Who linked an innovation to a submission: the matcher, the submitter (cards seen on search) or ROPS staff.</summary>
public enum LinkSource
{
    Match,
    Submitter,
    Admin
}
