"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { NOTIFICATION_POLL_MS } from "@/shared/account/useNotifications";
import { ApiError, serverMessage } from "@/shared/lib/api-error";

import { getMySubmission, replyToSubmission } from "../api/mySubmissionsApi";
import { mySubmissionKeys } from "./mySubmissionKeys";

/** One own submission, refreshed as often as notifications so a staff reply shows up without reloading. */
export function useMySubmission(id: string) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: mySubmissionKeys.detail(id),
    queryFn: () => getMySubmission(id),
    refetchInterval: NOTIFICATION_POLL_MS,
    retry: (count, error) => !(error instanceof ApiError && error.status === 404) && count < 1,
  });

  const reply = useMutation({
    mutationFn: (body: string) => replyToSubmission(id, body),
    onSuccess: (detail) => {
      queryClient.setQueryData(mySubmissionKeys.detail(id), detail);
      void queryClient.invalidateQueries({ queryKey: mySubmissionKeys.all, exact: true });
    },
  });

  return {
    submission: query.data,
    isLoading: query.isPending,
    isNotFound: query.error instanceof ApiError && query.error.status === 404,
    isError: query.isError,
    sendReply: async (body: string) => {
      try {
        await reply.mutateAsync(body);
        return true;
      } catch {
        return false;
      }
    },
    isSending: reply.isPending,
    /** The server's message, or "generic" when the failure has none (the UI translates that). */
    replyError: reply.isError ? (serverMessage(reply.error) ?? "generic") : undefined,
  };
}
