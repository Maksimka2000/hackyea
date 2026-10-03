import type { MatchResult } from "./match-result";

/** Everything the results column can show. */
export type SearchViewState =
  | { kind: "loading" }
  | { kind: "no-problem" }
  | { kind: "error"; isRateLimited: boolean; retry: () => void }
  | { kind: "empty" }
  | { kind: "results"; items: MatchResult[] };
