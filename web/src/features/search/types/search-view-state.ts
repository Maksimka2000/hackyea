import type { MatchResult } from "./match-result";

/** Why a search failed: 429 (rateLimited), 400 (invalid input) or anything else (generic). */
export type SearchErrorReason = "generic" | "rateLimited" | "invalid";

/** Everything the results column can show. */
export type SearchViewState =
  | { kind: "loading" }
  | { kind: "no-problem" }
  | { kind: "error"; reason: SearchErrorReason; retry: () => void }
  | { kind: "empty" }
  | { kind: "results"; items: MatchResult[]; isLowConfidence: boolean };
