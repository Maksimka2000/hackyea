using HubMi.Domain.Innovations;
using HubMi.Domain.Matching;
using HubMi.Features.Matching.Contracts;
using HubMi.Features.Matching.Ports;
using HubMi.Features.Matching.Validators;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace HubMi.Features.Matching.Services;

/// <summary>
/// Describe a problem, get solutions. Retrieval is delegated to the search port; this service analyzes the text,
/// scores the candidates, guarantees a full result list, derives the category and builds the match indicator.
/// </summary>
public sealed class MatchingService(
    QueryAnalyzer analyzer,
    RelevanceScorer scorer,
    IInnovationSearch search,
    IDocumentFrequencyProvider frequencies,
    IInnovationCategoryReader categories,
    IMatchRequestLog requestLog,
    IOptions<MatchingOptions> options,
    TimeProvider clock,
    ILogger<MatchingService> logger)
{
    private readonly MatchingOptions _options = options.Value;

    public async Task<MatchResponse> MatchAsync(ValidatedMatchRequest request, string? clientKey, CancellationToken cancellationToken)
    {
        var query = analyzer.Analyze(request.Text);
        var prefixes = query.Prefixes;

        var statistics = prefixes.Count > 0
            ? await frequencies.GetAsync(prefixes, cancellationToken)
            : CorpusStatistics.Empty;

        var candidates = prefixes.Count > 0
            ? await search.FindCandidatesAsync(prefixes, _options.CandidateLimit, cancellationToken)
            : [];

        var matched = candidates
            .Select(card => scorer.Score(card, query, statistics))
            .Where(s => s.HasMatch)
            .OrderByDescending(s => s.Score)
            .ThenBy(s => s.Innovation.Title, StringComparer.Ordinal)
            .ThenBy(s => s.Innovation.Id)
            .ToList();

        var picked = matched.Take(_options.ResultCount).ToList();
        await FillAsync(picked, request.Text, query, statistics, matched, cancellationToken);

        var allCategories = await categories.GetAllAsync(cancellationToken);
        var categoryNames = allCategories.ToDictionary(c => c.Id, c => c.Name, StringComparer.Ordinal);
        // With no matching word at all, any category would be a guess; show none rather than a misleading header.
        var category = matched.Count > 0 ? ResolveCategory(matched, allCategories) : null;

        var topPercent = picked.Count > 0 ? picked.Max(s => s.Percent) : 0;
        var confidence = topPercent < _options.PartialThreshold ? MatchConfidence.Low : MatchConfidence.Ok;

        await LogAsync(request, clientKey, category?.Id, picked, topPercent, confidence, cancellationToken);

        return new MatchResponse(
            confidence == MatchConfidence.Low ? "low" : "ok",
            request.Text,
            query.Words,
            category,
            picked.Select((s, i) => ToDto(s, i + 1, categoryNames)).ToList());
    }

    /// <summary>Never return a short list: typo-tolerant matches first, then cards from the best (or largest) category.</summary>
    private async Task FillAsync(
        List<ScoredInnovation> picked,
        string text,
        AnalyzedQuery query,
        CorpusStatistics statistics,
        List<ScoredInnovation> matched,
        CancellationToken cancellationToken)
    {
        var missing = _options.ResultCount - picked.Count;
        if (missing <= 0)
            return;

        var similar = await search.FindSimilarAsync(text, Ids(picked), missing, cancellationToken);
        picked.AddRange(similar.Select(card => scorer.Score(card, query, statistics)));

        missing = _options.ResultCount - picked.Count;
        if (missing <= 0)
            return;

        var preferred = (matched.Count > 0 ? matched : picked).FirstOrDefault()?.Innovation.CategoryId;
        var fillers = await search.GetFillersAsync(preferred, Ids(picked), missing, cancellationToken);
        picked.AddRange(fillers.Select(card => scorer.Score(card, query, statistics)));
    }

    private static List<Guid> Ids(IEnumerable<ScoredInnovation> cards) => cards.Select(s => s.Innovation.Id).ToList();

    private CategoryMatchDto? ResolveCategory(IReadOnlyList<ScoredInnovation> ranked, IReadOnlyList<InnovationCategory> allCategories)
    {
        if (ranked.Count == 0)
            return null;

        var names = allCategories.ToDictionary(c => c.Id, c => c.Name, StringComparer.Ordinal);

        // Sum the scores of the best cards per category; rank order breaks ties so the result is deterministic.
        var totals = ranked
            .Take(_options.CategoryTopN)
            .Select((s, index) => (s.Innovation.CategoryId, s.Score, index))
            .GroupBy(x => x.CategoryId)
            .Select(g => (Id: g.Key, Total: g.Sum(x => x.Score), First: g.Min(x => x.index)))
            .OrderByDescending(x => x.Total)
            .ThenBy(x => x.First)
            .ToList();

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

    private MatchResultDto ToDto(ScoredInnovation scored, int rank, Dictionary<string, string> categoryNames)
    {
        var card = scored.Innovation;
        var evidence = Shorten(card.Evidence, _options.EvidenceMaxLength);

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
                scored.MissingWords),
            Reason(scored),
            card.TargetGroup,
            evidence is not null,
            evidence ?? "Brak opisu testu w bibliotece ROPS.",
            card.VideoUrl,
            card.SourceUrl,
            string.Format(_options.CardUrlTemplate, card.Id));
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
    private static string Reason(ScoredInnovation scored)
    {
        if (!scored.HasMatch)
            return "Brak wspólnych słów z opisem, propozycja uzupełniająca.";

        var lead = scored.Level switch
        {
            MatchLevel.Good => "Pasuje do",
            MatchLevel.Partial => "Pasuje częściowo do",
            _ => "Luźne podobieństwo"
        };
        var words = string.Join(", ", scored.MatchedWords);
        var fields = string.Join(", ", scored.MatchedFields.Select(f => f.ToLowerInvariant()));

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
