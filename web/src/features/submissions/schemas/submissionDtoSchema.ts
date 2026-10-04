import { z } from "zod";

import { submissionStatuses, submissionTypes } from "@/shared/submissions/submissionModel";

/** POST /api/submissions → 201. */
export const createdSubmissionDtoSchema = z.object({
  id: z.string(),
  number: z.string(),
});

/** GET /api/submissions/mine. */
export const submissionSummaryListDtoSchema = z.array(
  z.object({
    id: z.string(),
    number: z.string(),
    type: z.enum(submissionTypes),
    title: z.string(),
    status: z.enum(submissionStatuses),
    category: z.object({ id: z.string(), name: z.string() }).nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    messageCount: z.number(),
  }),
);

/** POST /api/match, read only for the "similar innovations" hint before sending. */
export const similarInnovationsDtoSchema = z.object({
  results: z.array(
    z.object({
      innovationId: z.string(),
      title: z.string(),
      category: z.object({ name: z.string() }),
    }),
  ),
});

export type CreatedSubmissionDto = z.infer<typeof createdSubmissionDtoSchema>;
export type SubmissionSummaryDto = z.infer<typeof submissionSummaryListDtoSchema>[number];
