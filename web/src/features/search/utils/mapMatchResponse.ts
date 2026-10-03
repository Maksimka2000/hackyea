import type { MatchStrength } from "../constants/match-strengths";
import type { MatchLevel, MatchResponseDto } from "../schemas/matchResponseDtoSchema";
import type { MatchOutcome } from "../types/match-result";

/** The backend speaks of good / partial / weak matches; the interface calls them strong / possible / related. */
const strengthByLevel: Record<MatchLevel, MatchStrength> = {
  good: "strong",
  partial: "possible",
  weak: "related",
};

export function mapMatchResponse(dto: MatchResponseDto): MatchOutcome {
  const items = [...dto.results]
    .sort((first, second) => first.rank - second.rank)
    .map((result) => ({
      id: result.innovationId,
      title: result.title,
      summary: result.tagline ?? "",
      categoryName: result.category?.name ?? null,
      strength: strengthByLevel[result.indicator.level],
      matchedWords: result.indicator.matchedWords,
      // The backend fills `evidence` with a Polish placeholder when there is none; the card shows a translated one.
      evidenceNote: result.hasEvidence ? result.evidence : null,
      sourceUrl: result.sourceUrl,
    }));

  return { items, isLowConfidence: dto.confidence === "low" };
}
