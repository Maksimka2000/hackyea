import { z } from "zod";

import { isIdeaStage } from "../constants/idea-stages";
import {
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  PILOT_SCALE_MAX_LENGTH,
  PLACE_MAX_LENGTH,
  RESULTS_MAX_LENGTH,
  TARGET_GROUP_MAX_LENGTH,
  TARGET_GROUP_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
} from "../constants/submission-limits";
import { submissionTypes } from "../constants/submission-types";

/** Validation messages are translation keys (`Submit.errors.<key>`), resolved in the UI. */
export const submissionErrorKeys = [
  "descriptionTooShort",
  "descriptionTooLong",
  "titleTooShort",
  "titleTooLong",
  "targetGroupTooShort",
  "targetGroupTooLong",
  "stageRequired",
  "placeTooLong",
  "pilotScaleTooLong",
  "resultsRequired",
  "resultsTooLong",
] as const;

export type SubmissionErrorKey = (typeof submissionErrorKeys)[number];

export function isSubmissionErrorKey(value: unknown): value is SubmissionErrorKey {
  return submissionErrorKeys.some((key) => key === value);
}

const key = (errorKey: SubmissionErrorKey) => errorKey;

/*
  One flat schema for every type: fields that do not apply to the chosen type stay empty.
  Need and local challenge: description (title optional). Idea: title, target group, stage.
  Good practice: title, target group, stage, results (and optionally the pilot's scale).
*/
export const submissionFormSchema = z
  .object({
    type: z.enum(submissionTypes),
    title: z.string().trim(),
    description: z
      .string()
      .trim()
      .min(DESCRIPTION_MIN_LENGTH, { message: key("descriptionTooShort") })
      .max(DESCRIPTION_MAX_LENGTH, { message: key("descriptionTooLong") }),
    categoryId: z.string(),
    place: z.string().trim().max(PLACE_MAX_LENGTH, { message: key("placeTooLong") }),
    targetGroup: z.string().trim(),
    stage: z.string(),
    pilotScale: z.string().trim().max(PILOT_SCALE_MAX_LENGTH, { message: key("pilotScaleTooLong") }),
    results: z.string().trim().max(RESULTS_MAX_LENGTH, { message: key("resultsTooLong") }),
  })
  .superRefine((values, context) => {
    const isCard = values.type === "idea" || values.type === "goodPractice";

    if (values.title.length > TITLE_MAX_LENGTH) {
      context.addIssue({ code: "custom", path: ["title"], message: key("titleTooLong") });
    } else if (isCard && values.title.length < TITLE_MIN_LENGTH) {
      context.addIssue({ code: "custom", path: ["title"], message: key("titleTooShort") });
    }

    if (!isCard) {
      return;
    }

    if (values.targetGroup.length < TARGET_GROUP_MIN_LENGTH) {
      context.addIssue({ code: "custom", path: ["targetGroup"], message: key("targetGroupTooShort") });
    } else if (values.targetGroup.length > TARGET_GROUP_MAX_LENGTH) {
      context.addIssue({ code: "custom", path: ["targetGroup"], message: key("targetGroupTooLong") });
    }

    if (!isIdeaStage(values.stage)) {
      context.addIssue({ code: "custom", path: ["stage"], message: key("stageRequired") });
    }

    if (values.type === "goodPractice" && values.results.length === 0) {
      context.addIssue({ code: "custom", path: ["results"], message: key("resultsRequired") });
    }
  });

export type SubmissionFormValues = z.infer<typeof submissionFormSchema>;
