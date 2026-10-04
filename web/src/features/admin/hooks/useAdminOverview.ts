"use client";

import { useQuery } from "@tanstack/react-query";

import { getInbox, getOverview } from "../api/adminApi";
import { ADMIN_POLL_MS } from "../constants/admin-navigation";

/** Start-page figures and the newest unseen submissions, refreshed in the background so a new idea appears quickly. */
export function useAdminOverview() {
  const overview = useQuery({ queryKey: ["admin", "overview"], queryFn: getOverview, refetchInterval: ADMIN_POLL_MS, refetchOnWindowFocus: true });
  const unseen = useQuery({
    queryKey: ["admin", "inbox", "unseen-preview"],
    queryFn: () => getInbox({ unseen: true, page: 1, pageSize: 5 }),
    refetchInterval: ADMIN_POLL_MS,
    refetchOnWindowFocus: true,
  });

  return { overview, unseen };
}
