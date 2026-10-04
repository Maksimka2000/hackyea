import { z } from "zod";

/** GET /api/innovations/{id}/rating-summary; PUT .../rating returns the same shape. */
export const ratingSummaryDtoSchema = z.object({
  innovationId: z.string(),
  average: z.number().nullable(),
  count: z.number(),
  distribution: z.array(z.number()),
  myStars: z.number().nullable(),
});

export const feedbackKinds = ["feedback", "improvement"] as const;
export type FeedbackKind = (typeof feedbackKinds)[number];

/** POST /api/innovations/{id}/feedback. */
export const feedbackDtoSchema = z.object({ id: z.string(), kind: z.enum(feedbackKinds) });

export type RatingSummary = z.infer<typeof ratingSummaryDtoSchema>;

export const FEEDBACK_MIN_LENGTH = 5;
export const FEEDBACK_MAX_LENGTH = 2000;
