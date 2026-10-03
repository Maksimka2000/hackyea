import { apiBaseUrl, apiMode } from "@/shared/config/env";
import { fetchJson } from "@/shared/lib/fetch-json";

import { matchResponseDtoSchema } from "../schemas/matchResponseDtoSchema";
import type { MatchResult } from "../types/match-result";
import { mapMatchResponse } from "../utils/mapMatchResponse";

import { findMatchesMock } from "./matchesMock";

export async function findMatches(problem: string): Promise<MatchResult[]> {
  const dto =
    apiMode === "mock"
      ? await findMatchesMock(problem)
      : // PLACEHOLDER endpoint and body: replace when the backend defines them.
        await fetchJson(`${apiBaseUrl}/matches`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ problem }),
          schema: matchResponseDtoSchema,
        });

  return mapMatchResponse(dto);
}
