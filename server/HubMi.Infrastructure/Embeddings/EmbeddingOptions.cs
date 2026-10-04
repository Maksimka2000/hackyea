using System.ComponentModel.DataAnnotations;

namespace HubMi.Infrastructure.Embeddings;

/// <summary>
/// Local model settings: BGE-M3 (int8 ONNX, dense CLS embedding), the bge-reranker-v2-m3 cross-encoder (int8 ONNX) and the
/// SentencePiece vocabulary they share. Relative paths are resolved against the application directory.
/// </summary>
public sealed class EmbeddingOptions
{
    public const string SectionName = "Embeddings";

    [Required] public string ModelPath { get; set; } = "models/bge-m3-int8.onnx";
    [Required] public string RerankerModelPath { get; set; } = "models/bge-reranker-v2-m3-int8.onnx";
    [Required] public string TokenizerPath { get; set; } = "models/sentencepiece.bpe.model";

    /// <summary>Stored with every vector; vectors of another model are ignored and re-created.</summary>
    [Required] public string ModelId { get; set; } = "bge-m3-int8-v1";

    /// <summary>Tokens kept of a card text or a query; also the limit of a query + card pair for the reranker.</summary>
    [Range(16, 8192)] public int MaxTokens { get; set; } = 512;

    /// <summary>ONNX Runtime threads per inference; 0 lets the runtime decide.</summary>
    [Range(0, 64)] public int Threads { get; set; } = 0;

    /// <summary>How many embeddings may run at once; keeps a burst of requests from saturating the CPU.</summary>
    [Range(1, 32)] public int MaxConcurrency { get; set; } = 2;

    /// <summary>How often the index checks whether cards or vectors changed (picks up edits made on other instances).</summary>
    [Range(1, 3600)] public int RefreshSeconds { get; set; } = 10;

    /// <summary>How long a query + card pair may be for the reranker (its limit is 512 in practice; longer is slower).</summary>
    [Range(16, 8192)] public int RerankMaxTokens { get; set; } = 512;

    public static string Resolve(string path) => Path.IsPathRooted(path) ? path : Path.Combine(AppContext.BaseDirectory, path);
}
