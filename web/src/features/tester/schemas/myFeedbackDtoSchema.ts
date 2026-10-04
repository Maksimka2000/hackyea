import { z } from "zod";

import { feedbackKinds } from "./testerDtoSchema";

/** GET /api/me/feedback: the caller's own opinions and proposals, with the staff decision. */
export const myFeedbackListDtoSchema = z.array(
  z.object({
    id: z.string(),
    innovationId: z.string(),
    innovationTitle: z.string(),
    kind: z.enum(feedbackKinds),
    body: z.string(),
    status: z.enum(["new", "accepted", "rejected"]),
    staffNote: z.string().nullable(),
    createdAt: z.string(),
    reviewedAt: z.string().nullable(),
  }),
);

export type MyFeedbackDto = z.infer<typeof myFeedbackListDtoSchema>[number];

export type MyFeedback = Omit<MyFeedbackDto, "createdAt" | "reviewedAt"> & { createdAt: Date; reviewedAt: Date | null };
