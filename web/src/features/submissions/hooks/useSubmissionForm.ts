"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { useRouter } from "@/i18n/navigation";
import { useSavedProblem } from "@/shared/hooks/useSavedProblem";
import { ApiError } from "@/shared/lib/api-error";

import { createSubmission } from "../api/createSubmission";
import type { SubmissionType } from "../constants/submission-types";
import { submissionFormSchema, type SubmissionFormValues } from "../schemas/submissionFormSchema";
import { buildSubmissionPayload } from "../utils/buildSubmissionPayload";

const RATE_LIMITED_STATUS = 429;

export function useSubmissionForm(type: SubmissionType) {
  const router = useRouter();
  // A need that comes from a search starts with the description the person already typed.
  const savedProblem = useSavedProblem();

  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionFormSchema),
    values: {
      type,
      description: type === "need" ? (savedProblem ?? "") : "",
      areaId: "",
      place: "",
      submitterType: "",
      title: "",
      targetGroup: "",
      stage: "",
      email: "",
      emailConsent: false,
      website: "",
    },
    resetOptions: { keepDirtyValues: true },
  });

  const mutation = useMutation({
    mutationFn: createSubmission,
    onSuccess: ({ token }) => router.push(`/submissions/${encodeURIComponent(token)}?created=1`),
  });

  const onSubmit = form.handleSubmit((values) => {
    // Bots fill the hidden field: pretend nothing happened and send nothing.
    if (values.website.trim()) {
      return;
    }

    mutation.mutate(buildSubmissionPayload(values));
  });

  return {
    form,
    onSubmit,
    isSending: mutation.isPending || mutation.isSuccess,
    sendError: mutation.isError
      ? { isRateLimited: mutation.error instanceof ApiError && mutation.error.status === RATE_LIMITED_STATUS }
      : null,
  };
}
