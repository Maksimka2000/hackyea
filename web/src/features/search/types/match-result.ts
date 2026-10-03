import type { MatchStrength } from "../constants/match-strengths";

/** What a result card needs. Independent of the backend's field names. */
export type MatchResult = {
  id: string;
  title: string;
  summary: string;
  categoryName: string;
  strength: MatchStrength;
  /** Short note about the library's test of the solution; null when the library has none. */
  evidenceNote: string | null;
  sourceUrl: string;
};
