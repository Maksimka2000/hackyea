"use client";

import { Plus } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { ButtonLink } from "@/shared/ui/primitives/ButtonLink";
import { Input } from "@/shared/ui/primitives/Input";
import { Select } from "@/shared/ui/primitives/Select";

import { useAdminInnovationList, usePublicationActions } from "../../hooks/useKnowledgeAdmin";
import { publicationStatuses } from "../../schemas/adminDtoSchemas";
import { QueryState } from "../shell/QueryState";
import { ActionError } from "../submission/ActionError";

import { PublicationActions } from "./PublicationActions";
import { PublicationBadge } from "./PublicationBadge";

export function InnovationsTab() {
  const t = useTranslations("Admin.knowledge.innovations");
  const tStatus = useTranslations("Admin.publication.status");
  const format = useFormatter();
  const { filter, query, setFilter } = useAdminInnovationList();
  const actions = usePublicationActions("innovations");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-foreground" htmlFor="innovation-q">{t("search")}</label>
            <Input id="innovation-q" onChange={(event) => setFilter({ ...filter, q: event.target.value || undefined })} type="search" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-foreground" htmlFor="innovation-status">{t("status")}</label>
            <Select id="innovation-status" onChange={(event) => setFilter({ ...filter, status: event.target.value || undefined })} value={filter.status ?? ""}>
              <option value="">{t("all")}</option>
              {publicationStatuses.map((status) => (
                <option key={status} value={status}>{tStatus(status)}</option>
              ))}
            </Select>
          </div>
        </div>
        <ButtonLink href="/admin/knowledge/innovations/new">
          <Plus aria-hidden="true" className="size-5" />
          {t("new")}
        </ButtonLink>
      </div>
      <ActionError error={actions.error} />
      <QueryState isError={query.isError} isPending={query.isPending} />
      {query.data ? (
        <div className="border-line overflow-x-auto rounded-card border-border-strong">
          <table className="w-full min-w-[48rem] text-left">
            <caption className="sr-only">{t("caption")}</caption>
            <thead className="bg-tint text-sm text-muted">
              <tr>
                <th className="px-4 py-3" scope="col">{t("columns.title")}</th>
                <th className="px-4 py-3" scope="col">{t("columns.status")}</th>
                <th className="px-4 py-3" scope="col">{t("columns.rating")}</th>
                <th className="px-4 py-3" scope="col">{t("columns.updated")}</th>
                <th className="px-4 py-3" scope="col">{t("columns.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {query.data.map((row) => (
                <tr className="border-line border-x-0 border-b-0 border-border" key={row.id}>
                  <td className="px-4 py-3">
                    <Link className="font-bold text-primary underline" href={`/admin/knowledge/innovations/${row.id}`}>{row.title}</Link>
                    <span className="block text-sm text-muted">{row.categoryName}</span>
                  </td>
                  <td className="px-4 py-3"><PublicationBadge status={row.status} /></td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {row.averageRating !== null ? t("rating", { value: row.averageRating.toFixed(1), count: row.ratingCount }) : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{format.dateTime(new Date(row.updatedAt), { dateStyle: "short" })}</td>
                  <td className="px-4 py-3">
                    <PublicationActions
                      isPending={actions.isPending}
                      itemTitle={row.title}
                      onDelete={() => actions.remove(row.id)}
                      onStep={(step) => actions.run(row.id, step)}
                      status={row.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
