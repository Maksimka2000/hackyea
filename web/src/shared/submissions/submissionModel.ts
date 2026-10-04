import { z } from "zod";

import { splitParagraphs } from "@/shared/lib/split-paragraphs";

/*
  The submission shapes shared by the resident pages and the staff panel. Mirrors the backend
  (GET /api/submissions/{id} and GET /api/admin/submissions/{id}); enum values are the server's camelCase names.
*/
export const submissionTypes = ["need", "idea", "goodPractice", "localChallenge"] as const;
export const submissionStatuses = ["received", "inReview", "answered", "closed", "rejected"] as const;
export const ideaStages = ["idea", "smallPilot", "working"] as const;
export const linkSources = ["match", "submitter", "admin"] as const;

/** The main path shown on the timeline; "rejected" replaces "closed" when it happens. */
export const timelineSteps = ["received", "inReview", "answered", "closed"] as const;

export type SubmissionType = (typeof submissionTypes)[number];
export type SubmissionStatus = (typeof submissionStatuses)[number];
export type IdeaStage = (typeof ideaStages)[number];

const categoryDtoSchema = z.object({ id: z.string(), name: z.string() }).nullable();

export const submissionDetailDtoSchema = z.object({
  id: z.string(),
  number: z.string(),
  type: z.enum(submissionTypes),
  title: z.string(),
  description: z.string(),
  category: categoryDtoSchema,
  place: z.string().nullable(),
  targetGroup: z.string().nullable(),
  stage: z.enum(ideaStages).nullable(),
  pilotScale: z.string().nullable(),
  results: z.string().nullable(),
  status: z.enum(submissionStatuses),
  rejectionReason: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  firstResponseAt: z.string().nullable(),
  canvasId: z.string().nullable(),
  timeline: z.array(
    z.object({ from: z.enum(submissionStatuses).nullable(), to: z.enum(submissionStatuses), changedAt: z.string(), note: z.string().nullable() }),
  ),
  messages: z.array(z.object({ id: z.string(), fromStaff: z.boolean(), authorName: z.string(), body: z.string(), createdAt: z.string() })),
  linkedInnovations: z.array(z.object({ id: z.string(), title: z.string(), source: z.enum(linkSources), score: z.number().nullable() })),
  author: z
    .object({
      id: z.string(),
      displayName: z.string(),
      role: z.string(),
      organizationName: z.string().nullable(),
      municipality: z.string().nullable(),
    })
    .nullable(),
});

export type SubmissionDetailDto = z.infer<typeof submissionDetailDtoSchema>;

export type TimelineEntry = { status: SubmissionStatus; at: Date; note: string | null };

export type SubmissionMessage = { id: string; fromStaff: boolean; authorName: string; paragraphs: string[]; createdAt: Date };

export type SubmissionDetail = {
  id: string;
  number: string;
  type: SubmissionType;
  title: string;
  descriptionParagraphs: string[];
  description: string;
  category: { id: string; name: string } | null;
  place: string | null;
  targetGroup: string | null;
  stage: IdeaStage | null;
  pilotScale: string | null;
  results: string | null;
  status: SubmissionStatus;
  rejectionReason: string | null;
  createdAt: Date;
  firstResponseAt: Date | null;
  canvasId: string | null;
  /** The latest time each status was reached. */
  timeline: TimelineEntry[];
  messages: SubmissionMessage[];
  linkedInnovations: { id: string; title: string; source: (typeof linkSources)[number]; score: number | null }[];
  author: SubmissionDetailDto["author"];
};

export function mapSubmissionDetail(dto: SubmissionDetailDto): SubmissionDetail {
  return {
    id: dto.id,
    number: dto.number,
    type: dto.type,
    title: dto.title,
    description: dto.description,
    descriptionParagraphs: splitParagraphs(dto.description),
    category: dto.category,
    place: dto.place,
    targetGroup: dto.targetGroup,
    stage: dto.stage,
    pilotScale: dto.pilotScale,
    results: dto.results,
    status: dto.status,
    rejectionReason: dto.rejectionReason,
    createdAt: new Date(dto.createdAt),
    firstResponseAt: dto.firstResponseAt ? new Date(dto.firstResponseAt) : null,
    canvasId: dto.canvasId,
    timeline: dto.timeline.map((step) => ({ status: step.to, at: new Date(step.changedAt), note: step.note })),
    messages: dto.messages.map((message) => ({
      id: message.id,
      fromStaff: message.fromStaff,
      authorName: message.authorName,
      paragraphs: splitParagraphs(message.body),
      createdAt: new Date(message.createdAt),
    })),
    linkedInnovations: dto.linkedInnovations,
    author: dto.author,
  };
}

export const MESSAGE_MAX_LENGTH = 4000;
