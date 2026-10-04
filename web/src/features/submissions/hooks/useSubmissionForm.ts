"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { useRouter } from "@/i18n/navigation";
import { useSavedProblem } from "@/shared/hooks/useSavedProblem";
import { isApiError, serverMessage } from "@/shared/lib/api-error";

import { createSubmission } from "../api/createSubmission";
import type { SubmissionType } from "../constants/submission-types";
import { submissionFormSchema, type SubmissionFormValues } from "../schemas/submissionFormSchema";
import { buildSubmissionPayload } from "../utils/buildSubmissionPayload";
import { mySubmissionKeys } from "./mySubmissionKeys";

export type SendErrorState = { isRateLimited: boolean; serverMessage?: string };

export function useSubmissionForm(type: SubmissionType) {
  const router = useRouter();
  const queryClient = useQueryClient();
  // A need that comes from a search starts with the description the person already typed.
  const savedProblem = useSavedProblem();
  const startsFromSearch = type === "need" || type === "localChallenge";

  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionFormSchema),
    values: {
      type,
      title: "",
      description: startsFromSearch ? (savedProblem ?? "") : "",
      categoryId: "",
      place: "",
      targetGroup: "",
      stage: "",
      pilotScale: "",
      results: "",
    },
    resetOptions: { keepDirtyValues: true },
  });

  const mutation = useMutation({
    mutationFn: createSubmission,
    onSuccess: ({ id }) => {
      void queryClient.invalidateQueries({ queryKey: mySubmissionKeys.all });
      router.push(`/my-submissions/${encodeURIComponent(id)}?created=1`);
    },
  });

  // The server re-checks every rule; its (Polish) message is shown when it found something the form did not.
  const sendError: SendErrorState | null = mutation.isError
    ? { isRateLimited: isApiError(mutation.error, 429), serverMessage: serverMessage(mutation.error) }
    : null;

  return {
    form,
    onSubmit: form.handleSubmit((values) => mutation.mutate(buildSubmissionPayload(values))),
    isSending: mutation.isPending || mutation.isSuccess,
    sendError,
  };
}
