"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { LinkedInnovations } from "@/shared/submissions/LinkedInnovations";
import { StatusTimeline } from "@/shared/submissions/StatusTimeline";
import { SubmissionFacts } from "@/shared/submissions/SubmissionFacts";

import { useAdminSubmission } from "../../hooks/useAdminSubmission";
import { QueryState } from "../shell/QueryState";

import { LinksPanel } from "./LinksPanel";
import { ModerationPanel } from "./ModerationPanel";
import { PublishPanel } from "./PublishPanel";
import { StaffConversation } from "./StaffConversation";
import { StatusPanel } from "./StatusPanel";
import { SubmissionAdminHeader } from "./SubmissionAdminHeader";

type AdminSubmissionPageProps = Readonly<{
  id: string;
}>;

export function AdminSubmissionPage({ id }: AdminSubmissionPageProps) {
  const t = useTranslations("Admin.submission");
  const admin = useAdminSubmission(id);
  const submission = admin.submission;

  return (
    <div className="flex flex-col gap-6">
      <Link className="inline-flex items-center gap-2 font-semibold text-primary underline" href="/admin/inbox">
        <ArrowLeft aria-hidden="true" className="size-4" />
        {t("back")}
      </Link>
      {admin.isNotFound ? <p className="text-lg text-foreground">{t("notFound")}</p> : <QueryState isError={admin.isError} isPending={admin.isPending} />}
      {submission ? (
        <>
          <SubmissionAdminHeader submission={submission} />
          <div className="grid gap-6 xl:grid-cols-[1fr_22rem] xl:items-start">
            <div className="flex flex-col gap-6">
              <StaffConversation onSend={admin.reply} state={admin.replyState} submission={submission} />
              <SubmissionFacts submission={submission} />
              <StatusTimeline submission={submission} />
              <LinkedInnovations items={submission.linkedInnovations} />
            </div>
            <div className="flex flex-col gap-6">
              <StatusPanel key={submission.status} onChange={admin.changeStatus} state={admin.statusState} submission={submission} />
              <ModerationPanel onModerate={admin.moderate} state={admin.moderateState} submission={submission} />
              <LinksPanel onReplace={admin.replaceLinks} state={admin.linksState} submission={submission} />
              <PublishPanel onPublish={admin.publish} state={admin.publishState} submission={submission} />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
