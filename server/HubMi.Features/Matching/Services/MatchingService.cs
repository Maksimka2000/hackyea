using System.Text;
using HubMi.Domain.Innovations;
using HubMi.Domain.Matching;
using HubMi.Features.Matching.Contracts;
using HubMi.Features.Matching.Ports;
using HubMi.Features.Matching.Validators;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace HubMi.Features.Matching.Services;

/// <summary>
/// Describe a problem, get solutions. The vector search proposes the cards whose problem, solution or reviewed everyday sentences are
/// closest in meaning; below the floor F nothing is returned. The reranker then reads the text together with each candidate, and only
/// cards scoring at least T are returned, so "no match" is a valid answer. The keyword scorer only explains which of the user's words
/// each card contains. If the meaning models are unavailable the service falls back to keyword search.
/// </summary>
public sealed class MatchingService(
    QueryAnalyzer analyzer,
    RelevanceScorer scorer,
    ITextEmbedder embedder,
    IReranker reranker,
    IInnovationVectorIndex vectorIndex,
    IInnovationSearch search,
    IDocumentFrequencyProvider frequencies,
    IInnovationCategoryReader categories,
    IMatchRequestLog requestLog,
    MatchAnswerCache cache,
    IOptions<MatchingOptions> options,
    TimeProvider clock,
    ILogger<MatchingService> logger)
{
    private readonly MatchingOptions _options = options.Value;

    public async Task<MatchResponse> MatchAsync(ValidatedMatchRequest request, string? clientKey, CancellationToken cancellationToken)
    {
        // Same letters can be written as one or two code points; the models see them differently.
        request = request with { Text = request.Text.Normalize(NormalizationForm.FormC) };

        var query = analyzer.Analyze(request.Text);
        var statistics = query.Prefixes.Count > 0
            ? await frequencies.GetAsync(query.Prefixes, cancellationToken)
            : CorpusStatistics.Empty;

        var ranked = await RankByMeaningAsync(request.Text, query, statistics, cancellationToken);
        var semantic = ranked is not null;
        ranked ??= await RankByKeywordsAsync(query, statistics, cancellationToken);

        var picked = ranked.Take(_options.ResultCount).ToList();
        var allCategories = await categories.GetAllAsync(cancellationToken);
        var categoryNames = allCategories.ToDictionary(c => c.Id, c => c.Name, StringComparer.Ordinal);
        // Empty means empty: no cards, no category. A card that barely passed (0 %) still counts as a vote.
        var category = picked.Count > 0 ? ResolveCategory(ranked, allCategories) : null;

        var topPercent = picked.Count > 0 ? picked.Max(s => s.Percent) : 0;
        var confidence = topPercent < _options.PartialThreshold ? MatchConfidence.Low : MatchConfidence.Ok;

        await LogAsync(request, clientKey, category?.Id, picked, topPercent, confidence, cancellationToken);

        return new MatchResponse(
            confidence == MatchConfidence.Low ? "low" : "ok",
            request.Text,
            query.Words,
            category,
            picked.Select((s, i) => ToDto(s, i + 1, semantic, query, categoryNames)).ToList());
    }

    /// <summary>Null when the meaning models cannot answer, so the caller falls back to keywords; an empty list means "no match".</summary>
    private async Task<List<ScoredInnovation>?> RankByMeaningAsync(
        string text, AnalyzedQuery query, CorpusStatistics statistics, CancellationToken cancellationToken)
    {
        if (!embedder.IsReady || !vectorIndex.IsReady)
            return null;

        try
        {
            var cards = await FindCardsAsync(text, cancellationToken);
            return cards?
                .Select(c => scorer.Score(c.Card, query, statistics) with
                {
                    Score = c.Score,
                    Percent = c.Percent,
                    Level = scorer.LevelFor(c.Percent),
                    MatchedKind = c.Kind
                })
                .ToList();
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            logger.LogWarning(ex, "Meaning search failed; falling back to keyword search.");
            return null;
        }
    }

    private sealed record CardScore(Innovation Card, double Score, int Percent, string Kind);

    /// <summary>Vector search, early exit below F, rerank, keep score >= T. Best first. Null when the index has nothing to say.</summary>
    private async Task<List<CardScore>?> FindCardsAsync(string text, CancellationToken cancellationToken)
    {
        var cacheKey = $"{vectorIndex.Version}|{text.ToLowerInvariant()}";
        if (cache.TryGet(cacheKey, out List<CardScore>? cached))
            return cached;

        var vector = await embedder.EmbedAsync(text, cancellationToken);
        var hits = vectorIndex.Search(vector, _options.RetrievalLimit);
        if (hits.Count == 0)
            return null;

        var useReranker = reranker.IsReady;
        var floor = useReranker ? _options.RetrievalFloor : _options.RetrievalOnlyFloor;
        if (hits[0].Similarity < floor)
        {
            logger.LogInformation("No match: best similarity {Similarity:F3} is below the floor {Floor:F2}.", hits[0].Similarity, floor);
            return Remember(cacheKey, [], useReranker);
        }

        var candidateHits = hits.Where(h => h.Similarity >= floor).Take(_options.RerankCandidates).ToList();
        var byId = (await search.GetByIdsAsync(candidateHits.Select(h => h.InnovationId).ToList(), cancellationToken))
            .ToDictionary(c => c.Id);
        var candidates = candidateHits.Where(h => byId.ContainsKey(h.InnovationId)).ToList();

        IReadOnlyList<double>? rerank = null;
        if (useReranker)
        {
            try
            {
                var passages = candidates.Select(h => PassageTextBuilder.BuildRerank(byId[h.InnovationId])).ToList();
                rerank = await reranker.ScoreAsync(text, passages, cancellationToken);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                logger.LogWarning(ex, "Reranking failed; using the vector similarity alone.");
            }
        }

        var scored = candidates
            .Select((h, i) => rerank is null
                ? new CardScore(byId[h.InnovationId], h.Similarity, Percent(h.Similarity, _options.RetrievalOnlyFloor, _options.RetrievalOnlyCeiling), h.Kind)
                : new CardScore(byId[h.InnovationId], rerank[i], LogitPercent(rerank[i]), h.Kind))
            .ToList();

        // Scores and matched-row kinds only, never the user's text: queries can contain health information.
        logger.LogInformation(
            "Match scores ({Mode}): {Scores}",
            rerank is null ? "vector" : "rerank",
            string.Join(", ", scored.Take(5).Select((c, i) => $"{c.Score:F2}/{candidates[i].Similarity:F2}/{candidates[i].Kind}")));

        var threshold = rerank is null ? _options.RetrievalOnlyFloor : _options.RerankThreshold;
        var kept = scored
            .Where(c => c.Score >= threshold)
            .OrderByDescending(c => c.Score)
            .ThenBy(c => c.Card.Title, StringComparer.Ordinal)
            .ThenBy(c => c.Card.Id)
            .ToList();

        return Remember(cacheKey, kept, rerank is not null);
    }

    /// <summary>Linear share of the way from <paramref name="floor"/> (0 %) to <paramref name="ceiling"/> (100 %).</summary>
    private static int Percent(double value, double floor, double ceiling) =>
        (int)Math.Round(100 * Math.Clamp((value - floor) / (ceiling - floor), 0.0, 1.0));

    /// <summary>
    /// The reranker's probabilities pile up near 0 for everyday wording, so the percentage follows its logit instead:
    /// T is 0 % and <see cref="MatchingOptions.RerankCeiling"/> is 100 %.
    /// </summary>
    private int LogitPercent(double score) =>
        Percent(Logit(score), Logit(_options.RerankThreshold), Logit(_options.RerankCeiling));

    private static double Logit(double p) => Math.Log(Math.Clamp(p, 1e-9, 1 - 1e-9) / (1 - Math.Clamp(p, 1e-9, 1 - 1e-9)));

    private List<CardScore> Remember(string key, List<CardScore> cards, bool complete)
    {
        // A degraded answer (reranker down) is not kept: it should be recomputed once the reranker is back.
        if (complete && _options.CacheSeconds > 0)
            cache.Set(key, cards, TimeSpan.FromSeconds(_options.CacheSeconds));

        return cards;
    }

    private async Task<List<ScoredInnovation>> RankByKeywordsAsync(
        AnalyzedQuery query, CorpusStatistics statistics, CancellationToken cancellationToken)
    {
        if (query.Prefixes.Count == 0)
            return [];

        var candidates = await search.FindCandidatesAsync(query.Prefixes, _options.CandidateLimit, cancellationToken);

        return candidates
            .Select(card => scorer.Score(card, query, statistics))
            .Where(s => s.HasMatch)
            .OrderByDescending(s => s.Score)
            .ThenBy(s => s.Innovation.Title, StringComparer.Ordinal)
            .ThenBy(s => s.Innovation.Id)
            .ToList();
    }

    private CategoryMatchDto? ResolveCategory(IReadOnlyList<ScoredInnovation> ranked, IReadOnlyList<InnovationCategory> allCategories)
    {
        if (ranked.Count == 0)
            return null;

        var names = allCategories.ToDictionary(c => c.Id, c => c.Name, StringComparer.Ordinal);

        // Vote with the match percentage of the best cards (at least 1, so a card that barely passed still counts); rank order
        // breaks ties so the result is deterministic. Only the library's own categories can win.
        var totals = ranked
            .Where(s => names.ContainsKey(s.Innovation.CategoryId))
            .Take(_options.CategoryTopN)
            .Select((s, index) => (s.Innovation.CategoryId, Weight: (double)Math.Max(s.Percent, 1), index))
            .GroupBy(x => x.CategoryId)
            .Select(g => (Id: g.Key, Total: g.Sum(x => x.Weight), First: g.Min(x => x.index)))
            .OrderByDescending(x => x.Total)
            .ThenBy(x => x.First)
            .ToList();

        if (totals.Count == 0)
            return null;

        var winner = totals[0];
        var sum = totals.Sum(x => x.Total);
        var share = sum > 0 ? (int)Math.Round(100 * winner.Total / sum) : 100;

        var related = totals
            .Skip(1)
            .Where(x => winner.Total > 0 && x.Total >= _options.AlsoRelatedRatio * winner.Total)
            .Take(_options.MaxAlsoRelated)
            .Select(x => new CategoryRefDto(x.Id, NameOf(names, x.Id)))
            .ToList();

        return new CategoryMatchDto(winner.Id, NameOf(names, winner.Id), share, related);
    }

    private static string NameOf(Dictionary<string, string> names, string id) => names.GetValueOrDefault(id, id);

    private async Task LogAsync(
        ValidatedMatchRequest request,
        string? clientKey,
        string? categoryId,
        List<ScoredInnovation> picked,
        int topPercent,
        MatchConfidence confidence,
        CancellationToken cancellationToken)
    {
        // The log feeds admin trends only; a logging failure must not break the user's search.
        try
        {
            var entry = MatchRequest.Create(
                request.Text, request.Dictated, clock.GetUtcNow().UtcDateTime, categoryId, topPercent, confidence, clientKey);
            for (var i = 0; i < picked.Count; i++)
                entry.AddResult(picked[i].Innovation.Id, i + 1, picked[i].Percent, picked[i].Level);

            await requestLog.SaveAsync(entry, cancellationToken);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            logger.LogWarning(ex, "Could not log match request.");
        }
    }

    private MatchResultDto ToDto(ScoredInnovation scored, int rank, bool semantic, AnalyzedQuery query, Dictionary<string, string> categoryNames)
    {
        var card = scored.Innovation;
        var evidence = Shorten(card.Evidence, _options.EvidenceMaxLength);
        var why = MatchExplainer.Explain(card, scored.MatchedKind, query, scored.HasMatch);

        return new MatchResultDto(
            rank,
            card.Id,
            card.Title,
            card.Tagline,
            new CategoryRefDto(card.CategoryId, NameOf(categoryNames, card.CategoryId)),
            new MatchIndicatorDto(
                scored.Percent,
                LevelCode(scored.Level),
                LevelLabel(scored.Level),
                scored.MatchedWords,
                scored.MatchedFields,
                // A meaning match does not need the same words, so "missing words" would mislead; only the keyword fallback lists them.
                semantic ? [] : scored.MissingWords),
            Reason(scored, semantic, why),
            card.TargetGroup,
            evidence is not null,
            evidence ?? "Brak opisu testu w bibliotece ROPS.",
            card.VideoUrl,
            card.SourceUrl,
            string.Format(_options.CardUrlTemplate, card.Id),
            why);
    }

    private static string LevelCode(MatchLevel level) => level switch
    {
        MatchLevel.Good => "good",
        MatchLevel.Partial => "partial",
        _ => "weak"
    };

    private static string LevelLabel(MatchLevel level) => level switch
    {
        MatchLevel.Good => "Dobre dopasowanie",
        MatchLevel.Partial => "Pasuje częściowo",
        _ => "Luźne podobieństwo"
    };

    /// <summary>Plain-Polish reason built from the words that actually matched. No generated text.</summary>
    private static string Reason(ScoredInnovation scored, bool semantic, WhyDto why)
    {
        if (!scored.HasMatch)
        {
            var part = why.Field == MatchExplainer.SolutionField ? "rozwiązania" : "problemu";
            return semantic
                ? $"Dopasowanie znaczeniowe: opis {part} tej innowacji jest bliski temu, co opisujesz, choć nie zawiera tych samych słów."
                : "Brak wspólnych słów z opisem, propozycja uzupełniająca.";
        }

        var words = string.Join(", ", scored.MatchedWords);
        var fields = string.Join(", ", scored.MatchedFields.Select(f => f.ToLowerInvariant()));

        if (semantic)
        {
            var meaning = scored.Level switch
            {
                MatchLevel.Good => "Pasuje znaczeniem",
                MatchLevel.Partial => "Pasuje częściowo znaczeniem",
                _ => "Luźne podobieństwo znaczenia"
            };
            return $"{meaning}; wspólne słowa: {words} ({fields}).";
        }

        var lead = scored.Level switch
        {
            MatchLevel.Good => "Pasuje do",
            MatchLevel.Partial => "Pasuje częściowo do",
            _ => "Luźne podobieństwo"
        };
        return $"{lead}: {words} ({fields}).";
    }

    private static string? Shorten(string? text, int maxLength)
    {
        if (string.IsNullOrWhiteSpace(text))
            return null;
        if (text.Length <= maxLength)
            return text;

        var cut = text.LastIndexOf(' ', maxLength);
        return text[..(cut > maxLength / 2 ? cut : maxLength)].TrimEnd(' ', ',', ';', ':', '.') + "…";
    }
}
