"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { ApiError } from "@/shared/lib/api-error";
import { saveSeenInnovations } from "@/shared/lib/problem-session";

import { findMatches } from "../api/findMatches";
import type { SearchErrorReason, SearchViewState } from "../types/search-view-state";

const RATE_LIMITED_STATUS = 429;
const INVALID_INPUT_STATUS = 400;

function isRateLimited(error: unknown) {
  return error instanceof ApiError && error.status === RATE_LIMITED_STATUS;
}

function errorReason(error: unknown): SearchErrorReason {
  if (isRateLimited(error)) {
    return "rateLimited";
  }

  return error instanceof ApiError && error.status === INVALID_INPUT_STATUS ? "invalid" : "generic";
}

/** Runs the search for the saved problem text and reduces the query to one view state. */
export function useMatchSearch(problem: string | null | undefined): SearchViewState {
  const text = problem?.trim() ?? "";
  const hasProblem = text.length > 0;

  const query = useQuery({
    queryKey: ["matches", text],
    queryFn: () => findMatches(text),
    enabled: hasProblem,
    // Retrying a rate-limited or rejected request would not help.
    retry: (failureCount, error) => errorReason(error) === "generic" && failureCount < 1,
  });

  const shown = query.data?.items;
  useEffect(() => {
    if (shown) {
      saveSeenInnovations(shown.map((item) => item.id));
    }
  }, [shown]);

  if (problem === undefined) {
    return { kind: "loading" };
  }

  if (!hasProblem) {
    return { kind: "no-problem" };
  }

  if (query.isError) {
    return { kind: "error", reason: errorReason(query.error), retry: () => void query.refetch() };
  }

  if (query.isSuccess) {
    const { category, isLowConfidence, items } = query.data;
    return items.length > 0 ? { kind: "results", items, category, isLowConfidence } : { kind: "empty" };
  }

  return { kind: "loading" };
}
