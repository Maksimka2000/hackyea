"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthSession } from "@/shared/hooks/useAuthSession";
import { isSubmitterRole } from "@/shared/lib/auth-session";

import { getRatingSummary, rateInnovation, sendFeedback } from "../api/testerApi";
import type { FeedbackKind } from "../schemas/testerDtoSchema";

/** Star rating (anyone sees it; signed-in residents, NGOs and JSTs rate) plus feedback and improvement proposals. */
export function useInnovationTester(innovationId: string) {
  const session = useAuthSession();
  const queryClient = useQueryClient();
  const key = ["rating", innovationId, session?.user.id ?? "anonymous"] as const;

  const summary = useQuery({ queryKey: key, queryFn: () => getRatingSummary(innovationId), enabled: session !== undefined });

  const rate = useMutation({
    mutationFn: (stars: number) => rateInnovation(innovationId, stars),
    onSuccess: (data) => queryClient.setQueryData(key, data),
  });

  const feedback = useMutation({
    mutationFn: ({ body, kind }: { kind: FeedbackKind; body: string }) => sendFeedback(innovationId, kind, body),
  });

  return {
    canParticipate: isSubmitterRole(session?.user.role),
    isStaff: session?.user.role === "Admin",
    summary: summary.data,
    rate: (stars: number) => rate.mutate(stars),
    isRating: rate.isPending,
    rateFailed: rate.isError,
    sendFeedback: async (kind: FeedbackKind, body: string) => {
      try {
        await feedback.mutateAsync({ kind, body });
        return true;
      } catch {
        return false;
      }
    },
    isSendingFeedback: feedback.isPending,
    feedbackFailed: feedback.isError,
    feedbackSentKind: feedback.isSuccess ? feedback.variables.kind : null,
  };
}
