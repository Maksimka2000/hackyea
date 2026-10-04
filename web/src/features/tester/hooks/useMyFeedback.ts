"use client";

import { useQuery } from "@tanstack/react-query";

import { NOTIFICATION_POLL_MS } from "@/shared/account/useNotifications";

import { getMyFeedback } from "../api/getMyFeedback";

/** The caller's own opinions; refreshed like notifications so a staff decision shows up without reloading. */
export function useMyFeedback() {
  return useQuery({ queryKey: ["my-feedback"], queryFn: getMyFeedback, refetchInterval: NOTIFICATION_POLL_MS });
}
