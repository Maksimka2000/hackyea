import { apiBaseUrl } from "@/shared/config/env";
import { fetchJson } from "@/shared/lib/fetch-json";

import { createdSubmissionDtoSchema, type CreatedSubmissionDto } from "../schemas/submissionDtoSchema";
import type { CreateSubmissionRequest } from "../types/create-submission-request";

/** POST /api/submissions (signed-in resident, NGO or JST). Called from the browser, so it uses the public base URL. */
export async function createSubmission(request: CreateSubmissionRequest): Promise<CreatedSubmissionDto> {
  return fetchJson(`${apiBaseUrl}/submissions`, { method: "POST", json: request, schema: createdSubmissionDtoSchema });
}
