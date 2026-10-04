"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { serverMessage } from "@/shared/lib/api-error";

import { getFeedback, reviewFeedback } from "../api/adminApi";
import type { FeedbackStatus } from "../schemas/adminDtoSchemas";

export function useFeedbackAdmin() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<{ kind?: string; status?: string }>({ status: "new" });
  const query = useQuery({ queryKey: ["admin", "feedback", filter], queryFn: () => getFeedback(filter) });
  const review = useMutation({
    mutationFn: (input: { id: string; status: Exclude<FeedbackStatus, "new">; note: string }) => reviewFeedback(input.id, input.status, input.note),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "feedback"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
    },
  });

  return {
    filter,
    setFilter,
    query,
    review: (id: string, status: Exclude<FeedbackStatus, "new">, note: string) => review.mutate({ id, status, note }),
    isReviewing: review.isPending,
    reviewError: review.isError ? (serverMessage(review.error) ?? "generic") : undefined,
  };
}
