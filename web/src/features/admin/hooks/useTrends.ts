"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { getTrends } from "../api/adminApi";

export type TrendsFilter = { from?: string; to?: string; type?: string };

/** The trend dashboard data for a date window (yyyy-mm-dd, inclusive) and optional submission type. */
export function useTrends() {
  const [filter, setFilter] = useState<TrendsFilter>({});
  const query = useQuery({
    queryKey: ["admin", "trends", filter],
    queryFn: () =>
      getTrends({
        from: filter.from ? `${filter.from}T00:00:00Z` : undefined,
        to: filter.to ? `${filter.to}T23:59:59Z` : undefined,
        type: filter.type,
      }),
    placeholderData: keepPreviousData,
  });

  return { filter, setFilter, query };
}
