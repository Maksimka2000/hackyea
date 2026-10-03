import { z } from "zod";

import { submissionStatuses } from "../constants/submission-statuses";
import { submissionTypes } from "../constants/submission-types";

/*
  PROPOSED contract for the submission endpoints (simple on purpose, to be replaced by the agreed shape).
  Update this file and the mappers in `utils/` when the backend response is final.
*/
export const createSubmissionResponseDtoSchema = z.object({
  /** Unguessable value that identifies the submission in the private status link. */
  token: z.string(),
  /** Human-friendly number to quote when contacting ROPS. */
  reference: z.string(),
});

export const submissionStatusDtoSchema = z.object({
  reference: z.string(),
  type: z.enum(submissionTypes),
  status: z.enum(submissionStatuses),
  createdAt: z.string(),
  title: z.string().nullable(),
  description: z.string(),
  reply: z
    .object({
      text: z.string(),
      repliedAt: z.string(),
    })
    .nullable(),
});

export type CreateSubmissionResponseDto = z.infer<typeof createSubmissionResponseDtoSchema>;
export type SubmissionStatusDto = z.infer<typeof submissionStatusDtoSchema>;
