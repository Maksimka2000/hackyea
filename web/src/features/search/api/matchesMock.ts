import { ApiError } from "@/shared/lib/api-error";

import { matchResponseDtoSchema, type MatchLevel, type MatchResponseDto } from "../schemas/matchResponseDtoSchema";

import { mockCatalog } from "./matchesMockCatalog";

const MOCK_LATENCY_MS = 900;
const RESULT_COUNT = 3;
const NO_EVIDENCE_TEXT = "Brak opisu testu w bibliotece ROPS.";

type MockEntry = { id: (typeof mockCatalog)[number]["id"]; level: MatchLevel; percent: number };

/* Which example problems return which results. Like the backend, a text without a match gets low confidence. */
const mockResultSets: ReadonlyArray<{ pattern: RegExp; categoryId: string; categoryName: string; entries: MockEntry[] }> = [
  {
    pattern: /senior|starsz|samotn|sąsiad|opiek/i,
    categoryId: "dla-seniorow",
    categoryName: "Dla seniorów",
    entries: [
      { id: "terapeuta-przestrzeni", level: "good", percent: 82 },
      { id: "inteligentny-organizer-do-lekow", level: "partial", percent: 48 },
      { id: "organizator-kompleksowej-opieki-w-miejscu-zamieszkania", level: "partial", percent: 41 },
    ],
  },
  {
    pattern: /niepełnospr|dostęp|usług/i,
    categoryId: "dla-osob-o-ograniczonej-mobilnosci",
    categoryName: "Dla osób o ograniczonej mobilności",
    entries: [
      { id: "kompleksowa-pomoc-dla-osob-po-amputacji-konczyny-dolnej", level: "good", percent: 74 },
      { id: "urzedowy-ambaras", level: "partial", percent: 52 },
      { id: "pelnia-zdrowia", level: "partial", percent: 38 },
    ],
  },
  {
    pattern: /młod|stres|dzieci|nastol|rodzin/i,
    categoryId: "dla-dzieci-mlodziezy-i-rodziny",
    categoryName: "Dla dzieci, młodzieży i rodziny",
    entries: [
      { id: "komix-zyciowy", level: "good", percent: 68 },
      { id: "rodzina-adopcyjna-dorasta", level: "partial", percent: 44 },
      { id: "centrum-antydepresyjne", level: "weak", percent: 21 },
    ],
  },
];

const levelLabels: Record<MatchLevel, string> = {
  good: "Dobre dopasowanie",
  partial: "Pasuje częściowo",
  weak: "Luźne podobieństwo",
};

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
}

function recognizedTermsOf(problem: string) {
  return problem
    .toLowerCase()
    .split(/[^\p{L}]+/u)
    .filter((word) => word.length >= 4)
    .slice(0, 6);
}

/* Marks the user's words (4+ letters, matched by their first 4 letters) inside the card's short description, like the backend does. */
function toWhyDto(tagline: string, problem: string) {
  const prefixes = recognizedTermsOf(problem).map((word) => word.slice(0, 4));
  const highlights = [...tagline.matchAll(/\p{L}+/gu)]
    .filter((match) => prefixes.some((prefix) => match[0].toLowerCase().startsWith(prefix)))
    .map((match) => ({ start: match.index, length: match[0].length }));

  return { field: "problem" as const, excerpt: tagline, highlights, byMeaning: highlights.length === 0 };
}

function toResultDto(entry: MockEntry, rank: number, problem: string) {
  const card = mockCatalog.find((candidate) => candidate.id === entry.id);

  if (!card) {
    throw new Error(`Unknown mock innovation: ${entry.id}`);
  }

  return {
    rank,
    innovationId: card.id,
    title: card.title,
    tagline: card.tagline,
    indicator: {
      percent: entry.percent,
      level: entry.level,
      label: levelLabels[entry.level],
      matchedWords: [],
      matchedIn: [],
      missingWords: [],
    },
    reason: "",
    targetGroup: null,
    hasEvidence: card.evidence !== null,
    evidence: card.evidence ?? NO_EVIDENCE_TEXT,
    videoUrl: null,
    sourceUrl: card.sourceUrl,
    cardUrl: `/biblioteka/${card.id}`,
    why: toWhyDto(card.tagline ?? "", problem),
  };
}

/**
 * Shaped like the backend's POST /api/match response and parsed through the same schema.
 * Type "test-error" or "test-limit" in the problem field to preview the error states.
 */
export async function findMatchesMock(problem: string): Promise<MatchResponseDto> {
  await wait(MOCK_LATENCY_MS);

  if (/test-limit/i.test(problem)) {
    throw new ApiError(429);
  }

  if (/test-error/i.test(problem)) {
    throw new ApiError(500);
  }

  const resultSet = mockResultSets.find(({ pattern }) => pattern.test(problem));

  // The backend never returns a short list: with no match it pads with "filler" cards and reports low confidence.
  const entries: MockEntry[] =
    resultSet?.entries ??
    mockCatalog.slice(0, RESULT_COUNT).map((card) => ({ id: card.id, level: "weak" as const, percent: 10 }));

  return matchResponseDtoSchema.parse({
    confidence: resultSet ? "ok" : "low",
    text: problem,
    recognizedTerms: recognizedTermsOf(problem),
    category: resultSet ? { id: resultSet.categoryId, name: resultSet.categoryName, sharePercent: 70, alsoRelated: [] } : null,
    results: entries.map((entry, index) => toResultDto(entry, index + 1, problem)),
  });
}
