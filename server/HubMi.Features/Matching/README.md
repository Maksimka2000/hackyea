# Matching

Public workflow (`POST /api/match`, anonymous, rate limited): accept a description of a social need, find relevant innovations, and return the top 3 with a match indicator, a category header and source links. Keep the persistence implementations in Infrastructure.

How it works:

1. `MatchRequestValidator` strips markup and checks length (3-1000 characters).
2. `QueryAnalyzer` folds accents, drops stop words, repairs irregular forms, expands synonyms and cuts words to 5-letter prefix stems (a stand-in for a Polish stemmer). Word lists live in `HubMi.Api/search-config.json`.
3. `IInnovationSearch` retrieves candidates (Postgres full-text search, GIN index); `IDocumentFrequencyProvider` supplies IDF statistics.
4. `RelevanceScorer` ranks the candidates (IDF x field weight) and computes the match indicator: coverage of the query's important words, the words that matched and in which sections, and the words that did not.
5. `MatchingService` guarantees 3 results (typo-tolerant fallback, then fillers), derives the category from the top cards, and logs the request without personal data.

Results always refer to stored cards and carry their ROPS source link; no generated text is involved. Tune thresholds and word lists in `search-config.json`.
