"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useRouter } from "@/i18n/navigation";
import { ApiError, serverMessage } from "@/shared/lib/api-error";
import type { SubmissionDetail } from "@/shared/submissions/submissionModel";

import {
  changeSubmissionStatus,
  moderateSubmission,
  openSubmission,
  publishSubmissionAsInnovation,
  replaceSubmissionLinks,
  replyAsStaff,
} from "../api/adminApi";
import { ADMIN_POLL_MS } from "../constants/admin-navigation";

/** One submission in the staff panel and every staff action on it. Each action returns the updated submission. */
export function useAdminSubmission(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const key = ["admin", "submission", id] as const;

  const query = useQuery({
    queryKey: key,
    queryFn: () => openSubmission(id),
    refetchInterval: ADMIN_POLL_MS,
    retry: (count, error) => !(error instanceof ApiError && error.status === 404) && count < 1,
  });

  const apply = (detail: SubmissionDetail) => {
    queryClient.setQueryData(key, detail);
    void queryClient.invalidateQueries({ queryKey: ["admin", "inbox"] });
    void queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
  };

  const reply = useMutation({ mutationFn: (body: string) => replyAsStaff(id, body), onSuccess: apply });
  const status = useMutation({ mutationFn: (input: { status: string; note: string }) => changeSubmissionStatus(id, input.status, input.note), onSuccess: apply });
  const moderate = useMutation({ mutationFn: (body: Record<string, string | null>) => moderateSubmission(id, body), onSuccess: apply });
  const links = useMutation({ mutationFn: (ids: string[]) => replaceSubmissionLinks(id, ids), onSuccess: apply });
  const publish = useMutation({
    mutationFn: () => publishSubmissionAsInnovation(id),
    onSuccess: ({ innovationId }) => router.push(`/admin/knowledge/innovations/${innovationId}`),
  });

  const run = async <T,>(action: { mutateAsync: (value: T) => Promise<unknown> }, value: T) => {
    try {
      await action.mutateAsync(value);
      return true;
    } catch {
      return false;
    }
  };

  return {
    submission: query.data,
    isPending: query.isPending,
    isError: query.isError,
    isNotFound: query.error instanceof ApiError && query.error.status === 404,
    reply: (body: string) => run(reply, body),
    replyState: { isPending: reply.isPending, error: reply.isError ? (serverMessage(reply.error) ?? "generic") : undefined },
    changeStatus: (value: { status: string; note: string }) => run(status, value),
    statusState: { isPending: status.isPending, error: status.isError ? (serverMessage(status.error) ?? "generic") : undefined },
    moderate: (body: Record<string, string | null>) => run(moderate, body),
    moderateState: { isPending: moderate.isPending, error: moderate.isError ? (serverMessage(moderate.error) ?? "generic") : undefined },
    replaceLinks: (ids: string[]) => run(links, ids),
    linksState: { isPending: links.isPending, error: links.isError ? (serverMessage(links.error) ?? "generic") : undefined },
    publish: () => publish.mutate(),
    publishState: { isPending: publish.isPending || publish.isSuccess, error: publish.isError ? (serverMessage(publish.error) ?? "generic") : undefined },
  };
}

export type ActionState = { isPending: boolean; error?: string };
