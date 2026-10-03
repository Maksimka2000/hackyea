"use client";

import { useTranslations } from "next-intl";

import { useLibraryFilter } from "../hooks/useLibraryFilter";
import type { LibraryGroup } from "../types/library";

import { LibraryEmpty } from "./LibraryEmpty";
import { LibraryFilters } from "./LibraryFilters";
import { LibraryGroupSection } from "./LibraryGroupSection";
import { LibraryNoResults } from "./LibraryNoResults";

type LibraryBrowserProps = Readonly<{
  groups: LibraryGroup[];
  /** Show each category's name as a heading (whole-library view). */
  showGroupHeadings: boolean;
}>;

/** The filter box and the grouped lists. Filtering needs no request: the whole list is already on the page. */
export function LibraryBrowser({ groups, showGroupHeadings }: LibraryBrowserProps) {
  const t = useTranslations("Library.filters");
  const { filter, isActive, reset, setFilter, totalCount, visibleCount, visibleGroups } = useLibraryFilter(groups);

  if (totalCount === 0) {
    return <LibraryEmpty />;
  }

  return (
    <div className="flex min-w-0 flex-col gap-8">
      <LibraryFilters filter={filter} onChange={setFilter} />
      <p className="-mt-4 text-sm font-semibold text-muted" role="status">
        {isActive ? t("summary", { count: visibleCount, total: totalCount }) : null}
      </p>
      {visibleCount === 0 ? (
        <LibraryNoResults onReset={reset} />
      ) : (
        <div className="flex flex-col gap-12">
          {visibleGroups.map((group) => (
            <LibraryGroupSection group={group} key={group.category.id} showHeading={showGroupHeadings} />
          ))}
        </div>
      )}
    </div>
  );
}
