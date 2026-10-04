"use client";

import { useFormatter, useNow, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { ButtonLink } from "@/shared/ui/primitives/ButtonLink";

import { useAdminOverview } from "../../hooks/useAdminOverview";
import { useFormatHours } from "../../hooks/useFormatHours";
import { InboxTable } from "../inbox/InboxTable";
import { AdminPageHeader } from "../shell/AdminPageHeader";
import { QueryState } from "../shell/QueryState";
import { StatTile } from "../shell/StatTile";

export function AdminOverviewPage() {
  const t = useTranslations("Admin.overview");
  const format = useFormatter();
  const now = useNow({ updateInterval: 60_000 });
  const formatHours = useFormatHours();
  const { overview, unseen } = useAdminOverview();
  const data = overview.data;

  return (
    <>
      <AdminPageHeader lead={t("lead")} title={t("title")} />
      <QueryState isError={overview.isError} isPending={overview.isPending} />
      {data ? (
        <div aria-live="polite" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile emphasis={data.unseenSubmissions > 0} hint={t("unseenHint")} label={t("unseen")} value={data.unseenSubmissions} />
          <StatTile
            hint={data.oldestWaitingSince ? t("oldest", { time: format.relativeTime(new Date(data.oldestWaitingSince), now) }) : t("nobodyWaits")}
            label={t("waiting")}
            value={data.waitingForReply}
          />
          <StatTile hint={t("median", { value: formatHours(data.medianResponseHours) })} label={t("responseTime")} value={formatHours(data.averageResponseHours)} />
          <Link className="block rounded-card" href="/admin/feedback">
            <StatTile hint={t("toFeedback")} label={t("newFeedback")} value={data.newFeedback} />
          </Link>
        </div>
      ) : null}

      <section aria-labelledby="unseen-title" className="mt-10 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-extrabold text-foreground" id="unseen-title">
            {t("unseenTitle")}
          </h2>
          <ButtonLink href="/admin/inbox" variant="outline">
            {t("toInbox")}
          </ButtonLink>
        </div>
        <QueryState isError={unseen.isError} isPending={unseen.isPending} />
        {unseen.data ? <InboxTable caption={t("unseenTitle")} rows={unseen.data.items} /> : null}
      </section>
    </>
  );
}
