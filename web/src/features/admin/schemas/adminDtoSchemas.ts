import { z } from "zod";

import { submissionStatuses, submissionTypes } from "@/shared/submissions/submissionModel";

const categoryRef = z.object({ id: z.string(), name: z.string() }).nullable();
export const publicationStatuses = ["draft", "verified", "published"] as const;
export type PublicationStatus = (typeof publicationStatuses)[number];

/** GET /api/admin/overview. */
export const overviewDtoSchema = z.object({
  unseenSubmissions: z.number(),
  waitingForReply: z.number(),
  averageResponseHours: z.number().nullable(),
  medianResponseHours: z.number().nullable(),
  oldestWaitingSince: z.string().nullable(),
  newFeedback: z.number(),
});

/** GET /api/admin/submissions. */
export const inboxPageDtoSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      number: z.string(),
      type: z.enum(submissionTypes),
      title: z.string(),
      status: z.enum(submissionStatuses),
      category: categoryRef,
      authorName: z.string(),
      authorRole: z.string(),
      createdAt: z.string(),
      seen: z.boolean(),
      firstResponseAt: z.string().nullable(),
      responseHours: z.number().nullable(),
      messageCount: z.number(),
    }),
  ),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

export const publishedDraftDtoSchema = z.object({ innovationId: z.string() });

/** GET /api/admin/innovations. */
export const adminInnovationListDtoSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    categoryId: z.string(),
    categoryName: z.string().nullable(),
    status: z.enum(publicationStatuses),
    updatedAt: z.string(),
    averageRating: z.number().nullable(),
    ratingCount: z.number(),
  }),
);

/** GET /api/admin/innovations/{id}. */
export const adminInnovationDtoSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  title: z.string(),
  tagline: z.string().nullable(),
  solution: z.string().nullable(),
  problems: z.string().nullable(),
  targetGroup: z.string().nullable(),
  beneficiaries: z.string().nullable(),
  evidence: z.string().nullable(),
  sourceUrl: z.string(),
  videoUrl: z.string().nullable(),
  materialsUrl: z.string().nullable(),
  detailsPdfUrl: z.string().nullable(),
  licenseUrl: z.string(),
  disseminationBadge: z.string().nullable(),
  status: z.enum(publicationStatuses),
  verifiedAt: z.string().nullable(),
  updatedAt: z.string(),
});

export const createdDtoSchema = z.object({ id: z.string() });

export const challengeListDtoSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    categoryId: z.string().nullable(),
    source: z.string().nullable(),
    status: z.enum(publicationStatuses),
    updatedAt: z.string(),
  }),
);

export const materialTypes = ["article", "video", "guide"] as const;
export const materialListDtoSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    summary: z.string(),
    type: z.enum(materialTypes),
    url: z.string().nullable(),
    body: z.string().nullable(),
    status: z.enum(publicationStatuses),
    updatedAt: z.string(),
  }),
);

export const feedbackKinds = ["feedback", "improvement"] as const;
export const feedbackStatuses = ["new", "accepted", "rejected"] as const;
export const feedbackListDtoSchema = z.array(
  z.object({
    id: z.string(),
    innovationId: z.string(),
    innovationTitle: z.string(),
    kind: z.enum(feedbackKinds),
    body: z.string(),
    status: z.enum(feedbackStatuses),
    staffNote: z.string().nullable(),
    createdAt: z.string(),
    reviewedAt: z.string().nullable(),
    authorName: z.string().nullable(),
  }),
);

/** GET /api/admin/feedback/ratings: every rated card with its average, rating count and opinions still to review. */
export const ratingOverviewDtoSchema = z.array(
  z.object({ innovationId: z.string(), title: z.string(), average: z.number(), ratingCount: z.number(), newFeedbackCount: z.number() }),
);

const countByEnum = <T extends readonly [string, ...string[]]>(values: T) => z.partialRecord(z.enum(values), z.number());

/** GET /api/admin/trends. */
export const trendsDtoSchema = z.object({
  submissionsTotal: z.number(),
  categoriesTotal: z.number(),
  categoriesWithSubmissions: z.number(),
  uncategorised: z.number(),
  byCategory: z.array(
    z.object({
      categoryId: z.string().nullable(),
      name: z.string(),
      total: z.number(),
      byType: countByEnum(submissionTypes),
      byStatus: countByEnum(submissionStatuses),
    }),
  ),
  byWeek: z.array(z.object({ weekStart: z.string(), total: z.number(), byType: countByEnum(submissionTypes) })),
  bySubmitterRole: z.array(z.object({ role: z.string(), count: z.number() })),
  topUnmatchedQueries: z.array(z.object({ text: z.string(), count: z.number(), lastAskedAt: z.string() })),
  responseTime: z.object({
    averageHours: z.number().nullable(),
    medianHours: z.number().nullable(),
    answeredCount: z.number(),
    waitingCount: z.number(),
    oldestWaitingSince: z.string().nullable(),
    unseenCount: z.number(),
  }),
});

export type OverviewDto = z.infer<typeof overviewDtoSchema>;
export type InboxPageDto = z.infer<typeof inboxPageDtoSchema>;
export type InboxRow = InboxPageDto["items"][number];
export type AdminInnovationRow = z.infer<typeof adminInnovationListDtoSchema>[number];
export type AdminInnovation = z.infer<typeof adminInnovationDtoSchema>;
export type AdminChallenge = z.infer<typeof challengeListDtoSchema>[number];
export type AdminMaterial = z.infer<typeof materialListDtoSchema>[number];
export type MaterialType = (typeof materialTypes)[number];
export type RatedInnovation = z.infer<typeof ratingOverviewDtoSchema>[number];
export type FeedbackItem = z.infer<typeof feedbackListDtoSchema>[number];
export type FeedbackKind = (typeof feedbackKinds)[number];
export type FeedbackStatus = (typeof feedbackStatuses)[number];
export type TrendsDto = z.infer<typeof trendsDtoSchema>;
