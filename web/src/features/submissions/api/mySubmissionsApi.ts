import { apiBaseUrl } from "@/shared/config/env";
import { fetchJson } from "@/shared/lib/fetch-json";
import { mapSubmissionDetail, submissionDetailDtoSchema, type SubmissionDetail } from "@/shared/submissions/submissionModel";

import { similarInnovationsDtoSchema, submissionSummaryListDtoSchema } from "../schemas/submissionDtoSchema";
import type { SimilarInnovation, SubmissionSummary } from "../types/submission-summary";
import { mapSubmissionSummary } from "../utils/mapSubmissionSummary";

export async function getMySubmissions(): Promise<SubmissionSummary[]> {
  const dtos = await fetchJson(`${apiBaseUrl}/submissions/mine`, { schema: submissionSummaryListDtoSchema });
  return dtos.map(mapSubmissionSummary);
}

/** 404 (ApiError) when it does not exist or belongs to someone else. */
export async function getMySubmission(id: string): Promise<SubmissionDetail> {
  return mapSubmissionDetail(await fetchJson(`${apiBaseUrl}/submissions/${encodeURIComponent(id)}`, { schema: submissionDetailDtoSchema }));
}

export async function replyToSubmission(id: string, body: string): Promise<SubmissionDetail> {
  return mapSubmissionDetail(
    await fetchJson(`${apiBaseUrl}/submissions/${encodeURIComponent(id)}/messages`, {
      method: "POST",
      json: { body },
      schema: submissionDetailDtoSchema,
    }),
  );
}

/** Library cards close to the text, so the submitter can check the idea is new (UC4). Uses the public matching endpoint. */
export async function findSimilarInnovations(text: string): Promise<SimilarInnovation[]> {
  const dto = await fetchJson(`${apiBaseUrl}/match`, {
    method: "POST",
    json: { text: text.slice(0, 1000), inputMode: "typed" },
    schema: similarInnovationsDtoSchema,
  });

  return dto.results.map((result) => ({ id: result.innovationId, title: result.title, categoryName: result.category.name }));
}
