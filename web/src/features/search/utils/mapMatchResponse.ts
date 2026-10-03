import type { MatchResponseDto } from "../schemas/matchResponseDtoSchema";
import type { MatchResult } from "../types/match-result";

export function mapMatchResponse(dto: MatchResponseDto): MatchResult[] {
  return dto.results.map((result) => ({
    id: result.id,
    title: result.title,
    summary: result.tagline ?? "",
    categoryName: result.category.name,
    strength: result.strength,
    evidenceNote: result.evidence,
    sourceUrl: result.sourceUrl,
  }));
}
