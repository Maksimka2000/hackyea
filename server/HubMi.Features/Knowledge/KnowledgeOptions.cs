namespace HubMi.Features.Knowledge;

public sealed class KnowledgeOptions
{
    public const string SectionName = "Knowledge";

    /// <summary>Source link of a card written in HubMI itself; the card id is appended.</summary>
    public string OwnCardBaseUrl { get; set; } = "https://hubmi.pl/library/";

    /// <summary>Licence of cards written in HubMI, used when staff leave the field empty.</summary>
    public string DefaultLicenseUrl { get; set; } = "https://creativecommons.org/licenses/by/4.0/deed.pl";
}
