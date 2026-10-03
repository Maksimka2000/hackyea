import { ApiError } from "@/shared/lib/api-error";

import type { MatchStrength } from "../constants/match-strengths";
import { matchResponseDtoSchema, type MatchResponseDto } from "../schemas/matchResponseDtoSchema";

import { mockCatalog } from "./matchesMockCatalog";

const MOCK_LATENCY_MS = 900;

type MockEntry = { id: (typeof mockCatalog)[number]["id"]; strength: MatchStrength };

/* Which example problems return which results. Anything else returns no match. */
const mockResultSets: ReadonlyArray<{ pattern: RegExp; entries: MockEntry[] }> = [
  {
    pattern: /senior|starsz|samotn|sąsiad|opiek/i,
    entries: [
      { id: "terapeuta-przestrzeni", strength: "strong" },
      { id: "inteligentny-organizer-do-lekow", strength: "possible" },
      { id: "organizator-kompleksowej-opieki-w-miejscu-zamieszkania", strength: "possible" },
      { id: "centrum-antydepresyjne", strength: "related" },
    ],
  },
  {
    pattern: /niepełnospr|dostęp|usług/i,
    entries: [
      { id: "kompleksowa-pomoc-dla-osob-po-amputacji-konczyny-dolnej", strength: "strong" },
      { id: "urzedowy-ambaras", strength: "possible" },
      { id: "pelnia-zdrowia", strength: "possible" },
      { id: "stop-otylosci-innowacyjna-metoda-pracy-z-osobami-niepelnosprawnymi-intelektualnie", strength: "related" },
    ],
  },
  {
    pattern: /młod|stres|dzieci|nastol|rodzin/i,
    entries: [
      { id: "komix-zyciowy", strength: "strong" },
      { id: "rodzina-adopcyjna-dorasta", strength: "possible" },
      { id: "centrum-antydepresyjne", strength: "related" },
    ],
  },
];

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
}

/**
 * Parsed through the same schema as live data, so a drifting mock fails loudly.
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
  const results = (resultSet?.entries ?? []).map(({ id, strength }) => {
    const entry = mockCatalog.find((candidate) => candidate.id === id);

    if (!entry) {
      throw new Error(`Unknown mock innovation: ${id}`);
    }

    return {
      id: entry.id,
      title: entry.title,
      tagline: entry.tagline,
      category: entry.category,
      strength,
      evidence: entry.evidence,
      sourceUrl: entry.sourceUrl,
    };
  });

  return matchResponseDtoSchema.parse({ results });
}
