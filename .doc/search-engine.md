# Search engine: short reference

Current reference for the matching engine, with the final thresholds and the tuning result. Source of the facts: `server/HubMi.Features/Matching/README.md` and the code.

## Short workflow

### 1. Card preparation

| Step | Name | What happens | Technology |
|---|---|---|---|
| A1 | Read cards | Read the published cards from the database | PostgreSQL, EF Core |
| A2 | Build texts | Make 2 texts for each card: a problem text and a solution text | PassageTextBuilder |
| A3 | Clean lightly | Remove extra spaces and apply Unicode NFC. Keep all words and accents | .NET |
| A4 | Check for change | Compare the text hash and the model name. If both are the same, skip the text | SHA-256 |
| A5 | Embed | Change each text into one vector of 1024 numbers | BGE-M3 (local ONNX), tokenizer |
| A6 | Store | Write the vector into a `vector(1024)` column with an HNSW index | pgvector |
| A7 | Clean up | Delete the rows of old texts | EF Core |

### 2. Search

| Step | Name | What happens | Technology |
|---|---|---|---|
| B1 | Validate | Remove markup. Check the length (3–1000 characters) | MatchRequestValidator |
| B2 | Clean lightly | Use the same cleaning as A3 | .NET |
| B3 | Cache | If the same question was asked before, return the saved answer | memory cache |
| B4 | Stems | Change "Ł" to "L", remove stop words, cut words to 5 letters. The stems are only for the "why" text and the backup search | keyword analyzer |
| B5 | Embed question | Change the question into one vector | BGE-M3 |
| B6 | Vector search | Find the rows nearest to the question by cosine distance | pgvector, HNSW, `<=>` |
| B7 | Best row per card | Keep each card's best row. Keep the top 7 cards | .NET |
| B8 | Floor F | If the best similarity is less than 0.30, return "nothing found" (in practice this never happens, see "Tuning result") | MatchingService |
| B9 | Rerank | Read the question together with each of the 7 cards, and give a score | bge-reranker (local ONNX) |
| B10 | Threshold T | Remove cards with a reranker score below T (0.001). Keep up to 4 cards | MatchingService |
| B11 | Percent and category | Calculate the match % and the category vote | MatchingService |
| B12 | Explain | Select the best sentence from the card and highlight the shared words | MatchExplainer |
| B13 | Answer | Save the answer to the cache, write a log line without the user text, and return the answer | .NET |

**Backup path:** if a model is not available, use Postgres full-text search with the stems.

### 3. When a card changes

| Step | What happens |
|---|---|
| C1 | An admin saves the card, or the refresher finds a change (it checks every few seconds) |
| C2 | The indexer compares the hashes. Only the changed text is embedded again |
| C3 | The new vector replaces the old one in pgvector |
| C4 | The index version changes, so old cached answers stop working |
| C5 | The next search on every API server uses the new vector |

## Facts about the search engine

### Inputs and principles

- Only two inputs are compared: the user's text and the card text.
- The synthetic sentences are removed. No LLM has made any text that the search uses.
- "No LLM" is now fully true. Only the two local models run, and they do not generate text.
- There are no synonym lists and no word lists.
- The brief asked for near-zero cost and no external AI. The design uses no paid AI service and no GPU.

### Models (local, "offline")

- Both models are neural networks. They read text and give numbers. They do not write text.
- "Offline" means local. The model files are on the server, inside the API. No text goes to OpenAI or any other service. The search needs no internet.
- The models run at every search. They do not run only once.
- The models stay in RAM. RAM use is about 1.5–2 GB, because of the two models.

### Embedding (BGE-M3)

- Embedding is an action and a result. Example: "babcia jest sama" → `[0.12, -0.40, 0.88, …]` (1024 numbers).
- The model reads the whole text and gives one vector for it. It does not compare words one by one.
- The model reads all subword pieces together, so word order and context are part of the meaning.
- **Synonyms:** the model learned from a very large amount of text. "babcia", "osoba starsza" and "senior" are used in similar situations, so their vectors point in similar directions.
- **Typos:** the tokenizer is the first part of the embedding model, not a separate step. It splits text into subword pieces. A small typo changes only 1 or 2 pieces, so the vector moves only a little. A heavy typo moves the vector further, so the result can be weaker.
- The question is sent as natural text (from B2), not as stems.
- Azure equivalent: Azure OpenAI embeddings (paid, and the text leaves the server).

### Vector search (pgvector)

- pgvector is a Postgres extension that makes Postgres a vector database.
- Postgres calculates the cosine distance between the question vector and each stored vector. The smallest distance is the best match. This is a nearest neighbour search.
- Similarity = 1 − distance.
- The real query (`PostgresInnovationVectorIndex`) is:

```sql
SELECT innovation_id, kind, vector <=> @q AS distance
FROM   innovation_embedding
WHERE  model = 'bge-m3-int8-v1' AND <card is published>
ORDER  BY vector <=> @q
LIMIT  14;   -- 7 cards × 2 rows
```

- The column is named `vector`, not `embedding`.
- **HNSW index:** the index is a graph. Each vector links to some near neighbours. The search starts at an entry point and moves to nearer vectors. It checks only a part of the rows, so it stays fast with millions of rows.
- The index uses `vector_cosine_ops`, and the query uses `<=>`. They must match. If they do not, Postgres does not use the index.
- With about 230 rows, Postgres can read all rows instead of the index. The result is the same and still fast. HNSW gives no speed gain now, but it prepares the system for growth, so the app is scalable.

### Reranker (bge-reranker-v2-m3)

- It is a second neural network. It gets two texts, the question and one card, and gives one score: how well the card answers the question.
- It reads the top 7 cards, not 10.
- The card text is only `Problem: …` then `Rozwiązanie: …`. The title and the target group are not included. The problem goes first because it is the most important part.
- **Length limit:** 512 tokens for each pair. The question can use up to 256 tokens. 4 tokens are special markers. The card gets the rest, and any cut is made at the end. At about 3.8 characters per token, a problem plus the 600-character solution fits, so normally nothing is cut.
- **Difference from the vector search:** the embedding model makes the two vectors separately. The reranker reads the question and the card together. So the reranker is more exact, but slower.
- Azure equivalent: the semantic ranker in Azure AI Search (paid).

### Keyword analyzer

- It changes "Ł" to "L", removes accents and stop words, and cuts words to 5-letter stems.
- It is used only for the "why" highlights and the backup search. It does not choose the results.

## Final settings

| Setting | Value | Where |
|---|---|---|
| Cards from the vector search | 7 | `RetrievalLimit` |
| **Floor F** | **0.30** | `RetrievalFloor` |
| Cards for the reranker | 7 | `RerankCandidates` |
| **Threshold T** | **0.001** | `RerankThreshold` |
| Cards returned | up to 4 | `ResultCount` |

The values are in `server/HubMi.Api/search-config.json` (the source of truth), in the defaults of `server/docker-compose.hubmi.yml` and in `MatchingOptions.cs`. An environment variable (`Matching__RerankThreshold`, `Matching__RetrievalFloor`) overrides the file. The API logs the values it really uses at start: `Matching thresholds: F=… T=…`.

## Tuning result

**How it was measured.** The evaluation set `.doc/data/matching-eval.json` has 59 Polish queries: 37 with an expected card (25 clean, 6 with typos, 6 without accents) and 22 off-topic queries that must return nothing. `server/tools/tune-thresholds.sh` restarts the API for each pair of T and F, runs the set, and prints one row per pair. F stayed at 0.30.

| T | Acceptable card in the top 4 | Answerable queries with no result | Off-topic queries that got a card (of 22) |
|---|---|---|---|
| 0.005 | 25 / 37 (68 %) | 11 | 1 |
| 0.003 | 27 / 37 | 9 | 1 |
| 0.002 | 27 / 37 | 9 | 1 |
| **0.001** | **30 / 37 (81 %)** | **3** | **1** |
| 0.0005 | 30 / 37 | 0 | 4 |
| 0.0002 | 32 / 37 | 0 | 8 |

**Decision rule.** A wrong card is worse than no card, so the safety limit is at most 2 wrong cards on the 22 off-topic queries. Of the rows inside this limit, T = 0.001 has the most hits. Lower values only turn the last 3 empty answers into wrong cards.

**What the numbers mean.**

- T = 0.001 raised the hit rate from 68 % to 81 % and added no wrong card.
- The off-topic queries that leak at lower T are junk matches with accidental word overlap, for example "mój pies nie chce jeść" → "Himalaje autyzmu" and "wymiana dachu na domu" → "Obu – obuwie po domu".
- "jak nauczyć się programować w pythonie" → "Hear IT" appears at every T. The card teaches programming to deaf people, so it is a plausible match, and it is the one wrong card in the final result.
- **Floor F does nothing.** It stopped none of the 58 questions that were run, because BGE-M3 gives a cosine similarity above 0.30 even for unrelated text. The reranker threshold T is the real filter. A higher F (0.40–0.50) was not tested.

**What is still missing at T = 0.001.**

- 3 queries return nothing: "śpię na dworcu", its typo ("spie na dworczu") and its version without accents. The cards for homelessness use formal words ("kryzys bezdomności"), not "dworzec". The synthetic sentences used to cover this gap. They were removed on purpose.
- 8 answerable queries have a wrong category as the first result, for example "nikt do mnie nie dzwoni" and "jestem uchodźcą nie znam polskiego". For some of them the right card is still in the top 4.

## Honest limits

- **The 81 % is a tuned number.** T was chosen on the same 37 queries that it is measured on, so the real accuracy is probably lower. `.doc/data/matching-holdout.json` has 29 new queries (23 with an answer, 6 off-topic) written before the tuning. Run it once and report that result: `server/tools/eval-matching.sh http://localhost:8081 ../.doc/data/matching-holdout.json`. **This has not been done yet.**
- There is no baseline from before the change (synthetic sentences and in-memory index), so the effect of removing the synthetic sentences is not measured.
- The match percentage uses T as 0 %. Lowering T from 0.005 to 0.001 raised the percentage of every card. The labels "good" (65 %) and "partial" (30 %) were not reviewed after this change.
- RAM stays at about 1.5–2 GB, because of the two models. pgvector does not reduce it.
- With about 230 rows HNSW gives no speed gain. It prepares the system for growth.
- The expected cards in both query files were chosen from the card texts by one person. ROPS staff should review them.
