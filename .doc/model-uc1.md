# Data model: UC1 "Describe a problem, get solutions"

Scope: only what UC1 reads, writes and returns. UC2–UC11 will add entities later (Submission, Rating, Expert, …); they reuse the ones below.

Legend

- **Official** = taken from the ROPS Innovation Library or Mapa Wyzwań (see `.doc/data/library_raw.json`).
- **Added** = our enrichment, not published by ROPS.
- **Computed** = produced per request, not stored.
- `?` = optional.

Backend rules this model follows (`server/AGENTS.md`): Domain has no EF/HTTP/OpenAI dependency; state changes are methods, not public setters; matching is tied to stored innovation records and always returns source links; generated text never becomes an invented ROPS innovation.

---



## 1. Entities at a glance

```
ChallengeArea (8) ───────────────┐
   │ 1                           │ many-to-many
   │                             │
   └── KeyChallenge (n)     Innovation (115) ──── InnovationCategory (9)  [1 category per innovation]
                                 │ 1
                                 ├── Keyword (n)            Added
                                 └── (links to ROPS source, video, materials)

MatchRequest ──1──< MatchResult >──1── Innovation           Computed per request
     │
     └── ProblemSummary (area + short description)          Computed
```

Stored (seeded): **ChallengeArea, KeyChallenge, InnovationCategory, Innovation, Keyword.**
Per request: **MatchRequest, ProblemSummary, MatchResult.** Only `MatchRequest` is optionally logged (for UC9 trends).

---



## 2. Stored entities



### 2.1 ChallengeArea

One of the 8 areas of the Challenge Map. Source of "Co wiemy o tym problemie".


| Attribute            | Type                 | Required | Source   | Notes                                                                                                                                              |
| -------------------- | -------------------- | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Id`                 | slug                 | yes      | Added    | `seniorzy`, `bezdomnosc`, `niepelnosprawnosc`, `ubostwo`, `integracja-cudzoziemcow`, `zdrowie`, `zdrowie-psychiczne`, `rodzina-i-piecza-zastepcza` |
| `Name`               | text                 | yes      | Official | e.g. "Seniorzy"                                                                                                                                    |
| `Summary`            | text                 | yes      | Official | 2–3 sentences, shortened from the Map's definition and data analysis                                                                               |
| `PersonaName`        | text                 | no       | Official | e.g. "Janina, 73" (fictional, safe to show)                                                                                                        |
| `PersonaDescription` | text                 | no       | Official | Persona bullet points                                                                                                                              |
| `ReportLinks`        | list of {title, url} | no       | Official | Reports listed under "Dowiedz się więcej"                                                                                                          |
| `MapSourceNote`      | text                 | yes      | Official | "Mapa Wyzwań Społecznych, ROPS Kraków" (credit)                                                                                                    |




### 2.2 KeyChallenge

A bullet from the Map's "Kluczowe wyzwania" for one area.


| Attribute | Type            | Required | Source   | Notes                       |
| --------- | --------------- | -------- | -------- | --------------------------- |
| `Id`      | number          | yes      | Added    |                             |
| `AreaId`  | → ChallengeArea | yes      |          |                             |
| `Text`    | text            | yes      | Official | One challenge, one sentence |
| `Order`   | number          | yes      | Added    | Display order               |




### 2.3 InnovationCategory

The 9 library categories.


| Attribute | Type | Required | Source   | Notes                              |
| --------- | ---- | -------- | -------- | ---------------------------------- |
| `Id`      | slug | yes      | Official | e.g. `dla-seniorow` (the URL slug) |
| `Name`    | text | yes      | Official | e.g. "Dla seniorów"                |




### 2.4 Innovation

One library card. Official fields use the same six sections as the ROPS page.


| Attribute             | Type                    | Required | Source           | Notes                                                                                                                                 |
| --------------------- | ----------------------- | -------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `Id`                  | slug                    | yes      | Official         | e.g. `terapeuta-przestrzeni` (unique)                                                                                                 |
| `CategoryId`          | → InnovationCategory    | yes      | Official         | exactly one                                                                                                                           |
| `Title`               | text                    | yes      | Official         |                                                                                                                                       |
| `Tagline`             | text                    | yes      | Official         | The one-line description (used as "one sentence" on result cards). Missing on 1 card → fall back to the first sentence of `Solution`. |
| `Solution`            | text                    | yes*     | Official         | Section 1 "Na czym polega rozwiązanie?". *Missing on 1 card (`lekki-wozek-aktywny`).                                                  |
| `Problems`            | text                    | yes      | Official         | Section 2 "Jakich problemów dotyczy?"                                                                                                 |
| `TargetGroup`         | text                    | yes*     | Official         | Section 3. *Missing on 1 card.                                                                                                        |
| `Beneficiaries`       | text                    | yes      | Official         | Section 4 "Kto może skorzystać?" (institutions that can adopt it)                                                                     |
| `Evidence`            | text                    | no       | Official         | Section 5 "Czy to działa?". Missing on 4 cards → show "Brak opisu testu w bibliotece ROPS".                                           |
| `EvidenceSummary`     | text                    | no       | Added            | 1–2 sentence summary of `Evidence`, written once at seeding, kept faithful to the source                                              |
| `AuthorOrganisations` | list of text            | no       | Official         | **Organisations only.** Individual people's names are not stored (no real personal data rule).                                        |
| `DisseminationBadge`  | text                    | no       | Official         | e.g. "Inkubator Włączenia Społecznego" (27 cards)                                                                                     |
| `SourceUrl`           | url                     | yes      | Official         | The ROPS card page. **Always returned with results.**                                                                                 |
| `VideoUrl`            | url                     | no       | Official         | YouTube (26 cards)                                                                                                                    |
| `VideoDescription`    | text                    | no       | Added            | Text next to the video (accessibility); required when `VideoUrl` is set                                                               |
| `MaterialsUrl`        | url                     | no       | Official         | "pobierz materiały" zip                                                                                                               |
| `DetailsPdfUrl`       | url                     | no       | Official         | "dowiedz się więcej" folder (27 cards)                                                                                                |
| `LicenseUrl`          | url                     | yes      | Official         | CC BY 4.0 (100 cards) or ROPS rules PDF (15 cards)                                                                                    |
| `AreaIds`             | list of → ChallengeArea | yes      | Added            | 1–3 areas; many-to-many; assigned at seeding                                                                                          |
| `Keywords`            | list of Keyword         | yes      | Added            | See 2.5                                                                                                                               |
| `SearchText`          | text                    | yes      | Computed at seed | `Title + Tagline + Solution + Problems + TargetGroup + Keywords`, used for search                                                     |
| `Embedding`           | vector                  | no       | Added            | Optional, for semantic search; produced at seeding, never at request time for stored cards                                            |


Rules (domain invariants):

- `Title`, `SourceUrl`, `CategoryId`, `LicenseUrl` and at least one `AreaId` are always present.
- If `VideoUrl` is set, `VideoDescription` is set.
- `AuthorOrganisations` never contains a private person's name.
- An Innovation is only ever created by seeding or by admin editing (UC8); UC1 never changes it.



### 2.5 Keyword

Simple words that let short queries like "samotność senior leki" find cards.


| Attribute      | Type         | Required | Source | Notes                                  |
| -------------- | ------------ | -------- | ------ | -------------------------------------- |
| `Text`         | text         | yes      | Added  | Lower-case Polish word or short phrase |
| `InnovationId` | → Innovation | yes      |        |                                        |


Typical keywords: the problem (samotność, demencja, upadki), the person (senior, opiekun), the place (wieś), and the means (aplikacja, gra, terapia). Include common forms and synonyms (samotny, samotna, samotność).

---



## 3. Per-request objects (UC1 flow)



### 3.1 **MatchRequest**

What the user sent in step 3.


| Attribute        | Type                 | Required | Notes                                                   |
| ---------------- | -------------------- | -------- | ------------------------------------------------------- |
| `Id`             | id                   | yes      |                                                         |
| `Text`           | text                 | yes      | Free text or keywords. 3–1000 characters; trimmed.      |
| `InputMode`      | `typed` / `dictated` | yes      | For information only                                    |
| `ReceivedAt`     | datetime             | yes      |                                                         |
| `ResolvedAreaId` | → ChallengeArea      | no       | Filled after matching; used for UC9 trends              |
| `ClientKey`      | text                 | no       | Rate-limit key (IP hash). No account, no personal data. |


Stored only if we want UC9 trends from searches; otherwise purely in memory.

### 3.2 ProblemSummary *(computed)*

The "Co wiemy o tym problemie" block.


| Attribute          | Type                  | Notes                            |
| ------------------ | --------------------- | -------------------------------- |
| `Area`             | ChallengeArea         | Best-matching area               |
| `AreaSummary`      | text                  | `ChallengeArea.Summary`          |
| `KeyChallenges`    | list of text          | Top 3 `KeyChallenge` of the area |
| `ReportLinks`      | list of link          | From the area                    |
| `AlsoRelatedAreas` | list of ChallengeArea | Optional, max 2                  |


If no area scores above a minimum, return the nearest area and mark `LowConfidence = true`. Never return an empty block.

### 3.3 MatchResult *(computed)*

One suggested solution (3–5 per request).


| Attribute         | Type               | Required | Notes                                                                                                    |
| ----------------- | ------------------ | -------- | -------------------------------------------------------------------------------------------------------- |
| `Rank`            | 1–5                | yes      |                                                                                                          |
| `InnovationId`    | → Innovation       | yes      | Always a stored innovation. A result can never refer to something that is not in the library.            |
| `Title`           | text               | yes      | From Innovation                                                                                          |
| `OneSentence`     | text               | yes      | From `Tagline`                                                                                           |
| `WhyItFits`       | text               | yes      | Short plain-Polish reason, 1–2 sentences, generated from the user's text and this card's own fields only |
| `MatchedOn`       | list of text       | no       | Which of the user's words/aspects matched (e.g. "samotność", "leki")                                     |
| `EvidenceSummary` | text               | yes      | From Innovation (`EvidenceSummary`, else "Brak opisu testu…")                                            |
| `Score`           | 0–1                | yes      | Internal ranking value                                                                                   |
| `Strength`        | `good` / `partial` | yes      | `partial` when the card only matches part of the problem; shown as "Pasuje częściowo"                    |
| `SourceUrl`       | url                | yes      | Link to the ROPS card                                                                                    |
| `CardUrl`         | route              | yes      | Link to the full card in the app (UC3)                                                                   |


Result set rules:

- Always 3–5 results, even for short keyword input (**"always show results"**). If there are fewer good matches, fill with `partial` ones.
- Ranking = keyword/text match first, optional semantic similarity second; the LLM only writes `WhyItFits` and does not decide which cards exist.
- `WhyItFits` must not claim anything the card does not say; the caveat from `Evidence` is kept visible.
- Result also includes the link "Żadne nie pasuje? Wyślij zgłoszenie do ROPS" (UC2).

---



## 4. What the response contains

```
MatchResponse
├── Problem        : ProblemSummary      ("Co wiemy o tym problemie")
├── Solutions[3–5] : MatchResult         ("Proponowane rozwiązania")
└── FallbackLink   : route to UC2
```

---



## 5. Example (official data)

Input: `Mam 73 lata, mieszkam sama, czuję się samotna i biorę dużo leków`

```json
{
  "problem": {
    "area": { "id": "seniorzy", "name": "Seniorzy" },
    "areaSummary": "…",
    "keyChallenges": ["…", "…", "…"],
    "lowConfidence": false
  },
  "solutions": [
    {
      "rank": 1,
      "innovationId": "terapeuta-przestrzeni",
      "title": "Terapeuta przestrzeni",
      "oneSentence": "Innowacyjna usługa świadczona na rzecz osób starszych mieszkających samodzielnie albo z rodziną",
      "whyItFits": "Dla starszych osób mieszkających samotnie, które chcą zostać u siebie. Pomaga dostosować mieszkanie i daje wsparcie psychologiczne.",
      "matchedOn": ["mieszkam sama", "senior"],
      "evidenceSummary": "Test: większa samodzielność seniorów, zwłaszcza mieszkających samotnie. Uwaga: niska motywacja do zmian, zalecane silniejsze wsparcie psychologiczne.",
      "strength": "good",
      "sourceUrl": "https://rops.krakow.pl/innowacje-spoleczne/biblioteka-innowacji-spolecznych/dla-seniorow,terapeuta-przestrzeni"
    },
    { "rank": 2, "innovationId": "inteligentny-organizer-do-lekow", "strength": "good", "…": "…" },
    { "rank": 3, "innovationId": "centrum-antydepresyjne", "strength": "partial",
      "evidenceSummary": "Brak opisu testu w bibliotece ROPS.", "…": "…" }
  ],
  "fallbackLink": "/zgloszenie"
}
```

---



## 6. Input limits and safety (bounded public endpoint)

- `MatchRequest.Text`: 3–1000 characters; stripped of markup.
- Rate limit per `ClientKey`.
- No account needed (public endpoint); no personal data stored with the request.
- OpenAI is reached through a port; the key stays on the server.

---



## 7. Seed data to prepare


| Item                         | Count                | How                                                                            |
| ---------------------------- | -------------------- | ------------------------------------------------------------------------------ |
| ChallengeArea                | 8                    | From the Map PDF (text already extracted)                                      |
| KeyChallenge                 | ~5–8 per area        | From the Map's "Kluczowe wyzwania"                                             |
| InnovationCategory           | 9                    | From `.doc/data/library_raw.json`                                              |
| Innovation (official fields) | 115                  | `.doc/data/library_raw.json`; drop individual author names, keep organisations |
| Innovation → AreaIds         | 115                  | Assign 1–3 areas each (LLM pass, then spot-check)                              |
| Keywords                     | ~5–10 per innovation | LLM pass at seeding, then spot-check                                           |
| EvidenceSummary              | 111 (4 have none)    | LLM pass, kept faithful to the source                                          |
| VideoDescription             | 26                   | One sentence per video                                                         |


Known gaps in the official data: 1 card without `Solution`, 1 without `TargetGroup`, 4 without `Evidence`, 89 without video, 88 without details PDF; 1 duplicated title ("Dialog ponad kulturami", two different cards). The model above handles each with a defined fallback.