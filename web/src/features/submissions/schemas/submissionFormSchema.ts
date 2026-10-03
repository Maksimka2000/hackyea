import { z } from "zod";

import { isIdeaStage } from "../constants/idea-stages";
import {
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  PLACE_MAX_LENGTH,
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
  "emailInvalid",
  "consentRequired",
] as const;

export type SubmissionErrorKey = (typeof submissionErrorKeys)[number];

export function isSubmissionErrorKey(value: unknown): value is SubmissionErrorKey {
  return submissionErrorKeys.some((key) => key === value);
}

const key = (errorKey: SubmissionErrorKey) => errorKey;

/*
  One flat schema for both forms: fields that do not apply to the chosen type stay empty.
  An empty string means "not chosen" for the optional selects.
*/
export const submissionFormSchema = z
  .object({
    type: z.enum(submissionTypes),
    description: z
      .string()
      .trim()
      .min(DESCRIPTION_MIN_LENGTH, { message: key("descriptionTooShort") })
      .max(DESCRIPTION_MAX_LENGTH, { message: key("descriptionTooLong") }),
    categoryId: z.string(),
    place: z.string().trim().max(PLACE_MAX_LENGTH, { message: key("placeTooLong") }),
    submitterType: z.string(),
    title: z.string().trim(),
    targetGroup: z.string().trim(),
    stage: z.string(),
    email: z.string().trim(),
    emailConsent: z.boolean(),
    /** Honeypot: real people never see or fill it. */
    website: z.string(),
  })
  .superRefine((values, context) => {
    if (values.type === "idea") {
      if (values.title.length < TITLE_MIN_LENGTH) {
        context.addIssue({ code: "custom", path: ["title"], message: key("titleTooShort") });
      } else if (values.title.length > TITLE_MAX_LENGTH) {
        context.addIssue({ code: "custom", path: ["title"], message: key("titleTooLong") });
      }

      if (values.targetGroup.length < TARGET_GROUP_MIN_LENGTH) {
        context.addIssue({ code: "custom", path: ["targetGroup"], message: key("targetGroupTooShort") });
      } else if (values.targetGroup.length > TARGET_GROUP_MAX_LENGTH) {
        context.addIssue({ code: "custom", path: ["targetGroup"], message: key("targetGroupTooLong") });
      }

      if (!isIdeaStage(values.stage)) {
        context.addIssue({ code: "custom", path: ["stage"], message: key("stageRequired") });
      }
    }

    if (values.email) {
      if (!z.email().safeParse(values.email).success) {
        context.addIssue({ code: "custom", path: ["email"], message: key("emailInvalid") });
      } else if (!values.emailConsent) {
        context.addIssue({ code: "custom", path: ["emailConsent"], message: key("consentRequired") });
      }
    }
  });

export type SubmissionFormValues = z.infer<typeof submissionFormSchema>;
