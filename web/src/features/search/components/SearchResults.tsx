"use client";

import { useMatchSearch } from "../hooks/useMatchSearch";
import { useSavedProblem } from "@/shared/hooks/useSavedProblem";

import { EmptySearch } from "./EmptySearch";
import { NoMatchState } from "./NoMatchState";
import { ResultList } from "./ResultList";
import { ResultsSkeleton } from "./ResultsSkeleton";
import { ResultsStatus } from "./ResultsStatus";
import { SearchError } from "./SearchError";

export function SearchResults() {
  const state = useMatchSearch(useSavedProblem());

  if (state.kind === "no-problem") {
    return <EmptySearch />;
  }

  return (
    <div>
      <ResultsStatus state={state} />
      {state.kind === "loading" ? <ResultsSkeleton /> : null}
      {state.kind === "results" ? <ResultList items={state.items} /> : null}
      {state.kind === "empty" ? <NoMatchState /> : null}
      {state.kind === "error" ? <SearchError isRateLimited={state.isRateLimited} onRetry={state.retry} /> : null}
    </div>
  );
}
