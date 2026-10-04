"use client";

import { useMatchSearch } from "../hooks/useMatchSearch";
import { useSavedProblem } from "@/shared/hooks/useSavedProblem";

import { DetectedCategory } from "./DetectedCategory";
import { EmptySearch } from "./EmptySearch";
import { LowConfidenceNotice } from "./LowConfidenceNotice";
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
      {state.kind === "results" ? (
        <div className="flex flex-col gap-6">
          {state.category ? <DetectedCategory category={state.category} isLowConfidence={state.isLowConfidence} /> : null}
          {state.isLowConfidence ? <LowConfidenceNotice /> : null}
          <ResultList items={state.items} />
        </div>
      ) : null}
      {state.kind === "empty" ? <NoMatchState /> : null}
      {state.kind === "error" ? <SearchError reason={state.reason} onRetry={state.retry} /> : null}
    </div>
  );
}
