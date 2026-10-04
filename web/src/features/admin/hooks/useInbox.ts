"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { getInbox } from "../api/adminApi";
import { ADMIN_POLL_MS } from "../constants/admin-navigation";
import type { InboxFilter } from "../types/inbox-filter";

export const INBOX_PAGE_SIZE = 20;

export function useInbox() {
  const [filter, setFilter] = useState<InboxFilter>({ unseen: false, page: 1, pageSize: INBOX_PAGE_SIZE });
  const query = useQuery({
    queryKey: ["admin", "inbox", filter],
    queryFn: () => getInbox(filter),
    placeholderData: keepPreviousData,
    refetchInterval: ADMIN_POLL_MS,
    refetchOnWindowFocus: true,
  });

  return {
    filter,
    /** Any filter change goes back to page 1. */
    updateFilter: (change: Partial<Omit<InboxFilter, "page" | "pageSize">>) => setFilter((current) => ({ ...current, ...change, page: 1 })),
    goToPage: (page: number) => setFilter((current) => ({ ...current, page })),
    data: query.data,
    isPending: query.isPending,
    isError: query.isError,
    isFetching: query.isFetching,
  };
}
