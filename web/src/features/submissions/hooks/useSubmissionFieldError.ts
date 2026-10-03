"use client";

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import {
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  PLACE_MAX_LENGTH,
  TARGET_GROUP_MAX_LENGTH,
  TARGET_GROUP_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
} from "../constants/submission-limits";
import { isSubmissionErrorKey, type SubmissionFormValues } from "../schemas/submissionFormSchema";

/** Returns the translated error for one field, or undefined when it is valid. */
export function useSubmissionFieldError(name: keyof SubmissionFormValues): string | undefined {
  const t = useTranslations("Submit.errors");
  const {
    formState: { errors },
  } = useFormContext<SubmissionFormValues>();
  const message = errors[name]?.message;

  if (!isSubmissionErrorKey(message)) {
    return undefined;
  }

  return t(message, {
    descriptionMin: DESCRIPTION_MIN_LENGTH,
    descriptionMax: DESCRIPTION_MAX_LENGTH,
    titleMin: TITLE_MIN_LENGTH,
    titleMax: TITLE_MAX_LENGTH,
    targetGroupMin: TARGET_GROUP_MIN_LENGTH,
    targetGroupMax: TARGET_GROUP_MAX_LENGTH,
    placeMax: PLACE_MAX_LENGTH,
  });
}
