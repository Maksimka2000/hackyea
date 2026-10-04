"use client";

import { useMutation } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";

import { findSimilarInnovations } from "../api/mySubmissionsApi";
import type { SubmissionFormValues } from "../schemas/submissionFormSchema";

/** On request, looks up library cards similar to the idea typed so far (title and description). */
export function useSimilarInnovations() {
  const { getValues } = useFormContext<SubmissionFormValues>();
  const mutation = useMutation({ mutationFn: findSimilarInnovations });

  const check = () => {
    const text = `${getValues("title")} ${getValues("description")}`.trim();
    if (text.length >= 3) {
      mutation.mutate(text);
    }
  };

  return { check, items: mutation.data, isChecking: mutation.isPending, isError: mutation.isError };
}
