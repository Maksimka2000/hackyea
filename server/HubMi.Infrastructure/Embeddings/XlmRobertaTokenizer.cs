using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.ML.Tokenizers;

namespace HubMi.Infrastructure.Embeddings;

/// <summary>
/// The XLM-RoBERTa tokenizer both models share. The Hugging Face ids are the raw SentencePiece ids shifted by one, with
/// <c>&lt;s&gt;</c> = 0, <c>&lt;pad&gt;</c> = 1 and <c>&lt;/s&gt;</c> = 2. A missing vocabulary leaves <see cref="IsLoaded"/> false instead of stopping the API.
/// </summary>
internal sealed class XlmRobertaTokenizer
{
    public const int BeginOfSentence = 0;
    public const int Padding = 1;
    public const int EndOfSentence = 2;
    private const int IdOffset = 1;

    private readonly SentencePieceTokenizer? _tokenizer;

    public XlmRobertaTokenizer(IOptions<EmbeddingOptions> options, ILogger<XlmRobertaTokenizer> logger)
    {
        try
        {
            _tokenizer = SentencePieceTokenizer.Create(
                new MemoryStream(File.ReadAllBytes(EmbeddingOptions.Resolve(options.Value.TokenizerPath))), false, false, null);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Tokenizer vocabulary could not be loaded; matching falls back to keyword search.");
        }
    }

    public bool IsLoaded => _tokenizer is not null;

    /// <summary><c>&lt;s&gt; text &lt;/s&gt;</c>, cut to <paramref name="maxTokens"/>.</summary>
    public long[] Encode(string text, int maxTokens)
    {
        var ids = new List<long>(maxTokens) { BeginOfSentence };
        ids.AddRange(Pieces(text.Trim()).Take(maxTokens - 2));
        ids.Add(EndOfSentence);
        return ids.ToArray();
    }

    /// <summary>
    /// <c>&lt;s&gt; query &lt;/s&gt;&lt;/s&gt; passage &lt;/s&gt;</c>, cut to <paramref name="maxTokens"/>. The passage is cut first, so
    /// the user's words always stay.
    /// </summary>
    public long[] EncodePair(string query, string passage, int maxTokens)
    {
        var first = Pieces(query.Trim()).Take(maxTokens / 2).ToList();
        var second = Pieces(passage.Trim()).Take(Math.Max(0, maxTokens - first.Count - 4));

        var ids = new List<long>(maxTokens) { BeginOfSentence };
        ids.AddRange(first);
        ids.Add(EndOfSentence);
        ids.Add(EndOfSentence);
        ids.AddRange(second);
        ids.Add(EndOfSentence);
        return ids.ToArray();
    }

    private IEnumerable<long> Pieces(string text) =>
        _tokenizer!.EncodeToIds(text, false, false, true, true).Select(id => (long)id + IdOffset);
}
