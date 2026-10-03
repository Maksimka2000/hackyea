import { apiBaseUrl, apiMode } from "@/shared/config/env";
import { fetchJson } from "@/shared/lib/fetch-json";

import { createSubmissionResponseDtoSchema, type CreateSubmissionResponseDto } from "../schemas/submissionDtoSchema";
import type { CreateSubmissionRequest } from "../types/create-submission-request";

import { createSubmissionMock } from "./submissionsMock";

/** Called from the browser (a mutation), so it uses the public API base URL. */
export async function createSubmission(request: CreateSubmissionRequest): Promise<CreateSubmissionResponseDto> {
  if (apiMode === "mock") {
    return createSubmissionMock(request);
  }

  // PLACEHOLDER endpoint and body: replace when the backend defines them.
  return fetchJson(`${apiBaseUrl}/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    schema: createSubmissionResponseDtoSchema,
  });
}
