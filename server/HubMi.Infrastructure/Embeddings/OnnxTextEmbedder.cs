using HubMi.Features.Matching.Ports;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;

namespace HubMi.Infrastructure.Embeddings;

/// <summary>
/// Runs BGE-M3 in-process (ONNX Runtime, CPU). The dense embedding is the first (CLS) token of the last hidden state, L2-normalized;
/// the model needs no query or passage prefix. Load failures do not stop the API: <see cref="IsReady"/> stays false and matching falls
/// back to keyword search. <see cref="InferenceSession.Run(IReadOnlyCollection{NamedOnnxValue}, IReadOnlyCollection{string})"/> is thread-safe.
/// </summary>
internal sealed class OnnxTextEmbedder : ITextEmbedder, IDisposable
{
    private readonly EmbeddingOptions _options;
    private readonly XlmRobertaTokenizer _tokenizer;
    private readonly InferenceSession? _session;
    private readonly string _outputName = string.Empty;
    private readonly SemaphoreSlim _gate;

    public OnnxTextEmbedder(IOptions<EmbeddingOptions> options, XlmRobertaTokenizer tokenizer, ILogger<OnnxTextEmbedder> logger)
    {
        _options = options.Value;
        _tokenizer = tokenizer;
        _gate = new SemaphoreSlim(_options.MaxConcurrency);
        if (!tokenizer.IsLoaded)
            return;

        try
        {
            var sessionOptions = new SessionOptions();
            if (_options.Threads > 0)
                sessionOptions.IntraOpNumThreads = _options.Threads;

            _session = new InferenceSession(EmbeddingOptions.Resolve(_options.ModelPath), sessionOptions);
            _outputName = _session.OutputMetadata.ContainsKey("last_hidden_state")
                ? "last_hidden_state"
                : _session.OutputMetadata.Keys.First();

            var started = System.Diagnostics.Stopwatch.StartNew();
            Run("Dzień dobry, szukam pomocy.");
            logger.LogInformation("Embedding model {Model} loaded; warm-up took {Elapsed} ms.", _options.ModelId, started.ElapsedMilliseconds);
        }
        catch (Exception ex)
        {
            _session?.Dispose();
            _session = null;
            logger.LogWarning(ex, "Embedding model could not be loaded; matching falls back to keyword search.");
        }
    }

    public bool IsReady => _session is not null && _tokenizer.IsLoaded;

    public string ModelId => _options.ModelId;

    public async Task<float[]> EmbedAsync(string text, CancellationToken cancellationToken)
    {
        if (!IsReady)
            throw new InvalidOperationException("The embedding model is not loaded.");

        await _gate.WaitAsync(cancellationToken);
        try
        {
            return Run(text);
        }
        finally
        {
            _gate.Release();
        }
    }

    private float[] Run(string text)
    {
        var ids = _tokenizer.Encode(text, _options.MaxTokens);
        var length = ids.Length;
        var inputIds = new DenseTensor<long>(ids, [1, length]);
        var attentionMask = new DenseTensor<long>(Enumerable.Repeat(1L, length).ToArray(), [1, length]);

        var inputs = new List<NamedOnnxValue>
        {
            NamedOnnxValue.CreateFromTensor("input_ids", inputIds),
            NamedOnnxValue.CreateFromTensor("attention_mask", attentionMask)
        };

        using var results = _session!.Run(inputs, [_outputName]);
        var output = results.First().AsTensor<float>();

        // [1, tokens, dimensions] -> the first token; [1, dimensions] is already pooled.
        var dimensions = output.Dimensions[^1];
        var vector = output.ToArray().AsSpan(0, dimensions).ToArray();
        var norm = MathF.Sqrt(vector.Sum(x => x * x));
        if (norm > 0)
        {
            for (var i = 0; i < vector.Length; i++)
                vector[i] /= norm;
        }

        return vector;
    }

    public void Dispose()
    {
        _session?.Dispose();
        _gate.Dispose();
    }
}
