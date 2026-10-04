"use client";

import { useTranslations } from "next-intl";

import { Select } from "@/shared/ui/primitives/Select";

import { useFeedbackAdmin } from "../../hooks/useFeedbackAdmin";
import { feedbackKinds, feedbackStatuses } from "../../schemas/adminDtoSchemas";
import { AdminPageHeader } from "../shell/AdminPageHeader";
import { QueryState } from "../shell/QueryState";
import { ActionError } from "../submission/ActionError";

import { FeedbackCard } from "./FeedbackCard";

/** Innovation Tester results: opinions and improvement proposals on library cards, to accept or reject. */
export function AdminFeedbackPage() {
  const t = useTranslations("Admin.feedback");
  const { filter, isReviewing, query, review, reviewError, setFilter } = useFeedbackAdmin();

  return (
    <>
      <AdminPageHeader lead={t("lead")} title={t("title")} />
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-foreground" htmlFor="feedback-status">{t("filters.status")}</label>
          <Select id="feedback-status" onChange={(event) => setFilter({ ...filter, status: event.target.value || undefined })} value={filter.status ?? ""}>
            <option value="">{t("filters.all")}</option>
            {feedbackStatuses.map((status) => (
              <option key={status} value={status}>{t(`status.${status}`)}</option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-foreground" htmlFor="feedback-kind">{t("filters.kind")}</label>
          <Select id="feedback-kind" onChange={(event) => setFilter({ ...filter, kind: event.target.value || undefined })} value={filter.kind ?? ""}>
            <option value="">{t("filters.all")}</option>
            {feedbackKinds.map((kind) => (
              <option key={kind} value={kind}>{t(`kind.${kind}`)}</option>
            ))}
          </Select>
        </div>
      </div>
      <ActionError error={reviewError} />
      <QueryState isError={query.isError} isPending={query.isPending} />
      {query.data && query.data.length === 0 ? <p className="text-muted">{t("empty")}</p> : null}
      <ul className="flex flex-col gap-3">
        {(query.data ?? []).map((item) => (
          <li key={item.id}>
            <FeedbackCard isReviewing={isReviewing} item={item} onReview={review} />
          </li>
        ))}
      </ul>
    </>
  );
}
