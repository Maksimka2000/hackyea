"use client";

import { useSyncExternalStore } from "react";

import {
  getProblemSessionSnapshot,
  getServerProblemSessionSnapshot,
  subscribeToProblemSession,
} from "@/shared/lib/problem-session";

/** The problem text saved by the home form: undefined before hydration, null when nothing was saved. */
export function useSavedProblem() {
  return useSyncExternalStore<string | null | undefined>(
    subscribeToProblemSession,
    getProblemSessionSnapshot,
    getServerProblemSessionSnapshot,
  );
}
