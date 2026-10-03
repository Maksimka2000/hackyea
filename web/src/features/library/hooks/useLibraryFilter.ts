"use client";

import { useMemo, useState } from "react";

import { emptyLibraryFilter, type LibraryFilter } from "../types/library-filter";
import type { LibraryGroup } from "../types/library";
import { countItems, filterGroups, isFilterActive } from "../utils/filterLibrary";

/** Holds the filter the visitor typed or ticked and the cards that pass it. Filtering happens in the browser. */
export function useLibraryFilter(groups: LibraryGroup[]) {
  const [filter, setFilter] = useState<LibraryFilter>(emptyLibraryFilter);

  const visibleGroups = useMemo(() => filterGroups(groups, filter), [groups, filter]);

  return {
    filter,
    setFilter: (changes: Partial<LibraryFilter>) => setFilter((current) => ({ ...current, ...changes })),
    reset: () => setFilter(emptyLibraryFilter),
    isActive: isFilterActive(filter),
    visibleGroups,
    visibleCount: countItems(visibleGroups),
    totalCount: countItems(groups),
  };
}
