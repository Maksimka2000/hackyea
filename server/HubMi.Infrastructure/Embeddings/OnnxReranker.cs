using HubMi.Features.Matching.Ports;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;

namespace HubMi.Infrastructure.Embeddings;

/// <summary>
/// Runs bge-reranker-v2-m3 in-process (ONNX Runtime, CPU). Each query + card pair gives one logit; a sigmoid turns it into 0-1.
/// All pairs go through the model as one batch padded to the longest. Load failures leave <see cref="IsReady"/> false.
/// </summary>
internal sealed class OnnxReranker : IReranker, IDisposable
{
    private readonly EmbeddingOptions _options;
    private readonly XlmRobertaTokenizer _tokenizer;
    private readonly InferenceSession? _session;
    private readonly bool _needsTokenTypes;
    private readonly SemaphoreSlim _gate = new(1);

    public OnnxReranker(IOptions<EmbeddingOptions> options, XlmRobertaTokenizer tokenizer, ILogger<OnnxReranker> logger)
    {
        _options = options.Value;
        _tokenizer = tokenizer;
        if (!tokenizer.IsLoaded)
            return;

        try
        {
            var sessionOptions = new SessionOptions();
            if (_options.Threads > 0)
                sessionOptions.IntraOpNumThreads = _options.Threads;

            _session = new InferenceSession(EmbeddingOptions.Resolve(_options.RerankerModelPath), sessionOptions);
            _needsTokenTypes = _session.InputMetadata.ContainsKey("token_type_ids");

            var started = System.Diagnostics.Stopwatch.StartNew();
            Run("Dzień dobry", ["Pomoc dla seniorów."]);
            logger.LogInformation("Reranker loaded; warm-up took {Elapsed} ms.", started.ElapsedMilliseconds);
        }
        catch (Exception ex)
        {
            _session?.Dispose();
            _session = null;
            logger.LogWarning(ex, "Reranker could not be loaded; matching uses the vector similarity alone.");
        }
    }

    public bool IsReady => _session is not null && _tokenizer.IsLoaded;

    public async Task<IReadOnlyList<double>> ScoreAsync(string query, IReadOnlyList<string> passages, CancellationToken cancellationToken)
    {
        if (!IsReady)
            throw new InvalidOperationException("The reranker is not loaded.");
        if (passages.Count == 0)
            return [];

        // One batch at a time: the model is the most expensive step and a burst of requests must not saturate the CPU.
        await _gate.WaitAsync(cancellationToken);
        try
        {
            return Run(query, passages);
        }
        finally
        {
            _gate.Release();
        }
    }

    private double[] Run(string query, IReadOnlyList<string> passages)
    {
        var pairs = passages.Select(p => _tokenizer.EncodePair(query, p, _options.RerankMaxTokens)).ToList();
        var width = pairs.Max(p => p.Length);

        var ids = new long[pairs.Count * width];
        var mask = new long[pairs.Count * width];
        for (var row = 0; row < pairs.Count; row++)
        {
            for (var col = 0; col < width; col++)
            {
                var present = col < pairs[row].Length;
                ids[row * width + col] = present ? pairs[row][col] : XlmRobertaTokenizer.Padding;
                mask[row * width + col] = present ? 1 : 0;
            }
        }

        int[] shape = [pairs.Count, width];
        var inputs = new List<NamedOnnxValue>
        {
            NamedOnnxValue.CreateFromTensor("input_ids", new DenseTensor<long>(ids, shape)),
            NamedOnnxValue.CreateFromTensor("attention_mask", new DenseTensor<long>(mask, shape))
        };
        if (_needsTokenTypes)
            inputs.Add(NamedOnnxValue.CreateFromTensor("token_type_ids", new DenseTensor<long>(new long[ids.Length], shape)));

        using var results = _session!.Run(inputs);
        var logits = results.First().AsTensor<float>().ToArray();

        return logits.Take(pairs.Count).Select(l => 1.0 / (1.0 + Math.Exp(-l))).ToArray();
    }

    public void Dispose()
    {
        _session?.Dispose();
        _gate.Dispose();
    }
}
