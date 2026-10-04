namespace HubMi.Infrastructure.Persistence;

public sealed class PersistenceOptions
{
    public const string SectionName = "Persistence";

    /// <summary>Apply pending EF migrations when the API starts.</summary>
    public bool MigrateOnStartup { get; set; }

    /// <summary>When the library is empty, load the bundled sample export (Imports/SampleData/library.json).</summary>
    public bool SeedSampleLibrary { get; set; }

    /// <summary>Create the account roles and the demo accounts (Imports/SampleData/demo-accounts.json) that do not exist yet.</summary>
    public bool SeedIdentity { get; set; }
}
