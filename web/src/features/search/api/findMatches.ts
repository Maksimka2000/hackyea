import { apiBaseUrl, apiModeFor } from "@/shared/config/env";
import { fetchJson } from "@/shared/lib/fetch-json";

import { matchResponseDtoSchema } from "../schemas/matchResponseDtoSchema";
import type { MatchOutcome } from "../types/match-result";
import { mapMatchResponse } from "../utils/mapMatchResponse";

import { findMatchesMock } from "./matchesMock";

const INPUT_MODE = "typed";

export async function findMatches(problem: string): Promise<MatchOutcome> {
  const dto =
    apiModeFor("matching") === "mock"
      ? await findMatchesMock(problem)
      : // Backend: POST /api/match (rate limited to 20 requests per minute, 429 when exceeded).
        await fetchJson(`${apiBaseUrl}/match`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: problem, inputMode: INPUT_MODE }),
          schema: matchResponseDtoSchema,
        });

  return mapMatchResponse(dto);
}
