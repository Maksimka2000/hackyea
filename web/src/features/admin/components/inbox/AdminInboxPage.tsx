"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/primitives/Button";

import { useInbox } from "../../hooks/useInbox";
import { AdminPageHeader } from "../shell/AdminPageHeader";
import { QueryState } from "../shell/QueryState";

import { InboxFilters } from "./InboxFilters";
import { InboxTable } from "./InboxTable";

/** All incoming needs, ideas, practices and local challenges, newest first, refreshed in the background. */
export function AdminInboxPage() {
  const t = useTranslations("Admin.inbox");
  const { data, filter, goToPage, isError, isPending, updateFilter } = useInbox();
  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <>
      <AdminPageHeader lead={t("lead")} title={t("title")} />
      <div className="flex flex-col gap-6">
        <InboxFilters filter={filter} onChange={updateFilter} />
        <QueryState isError={isError} isPending={isPending} />
        {data ? (
          <>
            <p aria-live="polite" className="text-sm text-muted" role="status">
              {t("count", { count: data.total })}
            </p>
            <InboxTable caption={t("title")} rows={data.items} />
            {pages > 1 ? (
              <nav aria-label={t("pagination")} className="flex items-center gap-3">
                <Button disabled={filter.page <= 1} onClick={() => goToPage(filter.page - 1)} variant="outline">{t("previous")}</Button>
                <span className="text-foreground">{t("page", { page: filter.page, pages })}</span>
                <Button disabled={filter.page >= pages} onClick={() => goToPage(filter.page + 1)} variant="outline">{t("next")}</Button>
              </nav>
            ) : null}
          </>
        ) : null}
      </div>
    </>
  );
}
