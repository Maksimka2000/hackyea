"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { LinkedInnovations } from "@/shared/submissions/LinkedInnovations";
import { StatusTimeline } from "@/shared/submissions/StatusTimeline";
import { SubmissionFacts } from "@/shared/submissions/SubmissionFacts";
import { Container } from "@/shared/ui/primitives/Container";
import { Skeleton } from "@/shared/ui/primitives/Skeleton";

import { useMySubmission } from "../hooks/useMySubmission";

import { Conversation } from "./Conversation";
import { CreatedBanner } from "./CreatedBanner";
import { SubmissionHeader } from "./SubmissionHeader";

type MySubmissionViewProps = Readonly<{
  id: string;
  justCreated: boolean;
}>;

export function MySubmissionView({ id, justCreated }: MySubmissionViewProps) {
  const t = useTranslations("MySubmission");
  const { isError, isLoading, isNotFound, isSending, replyError, sendReply, submission } = useMySubmission(id);

  if (isLoading) {
    return (
      <Container className="py-12">
        <Skeleton className="h-64" />
      </Container>
    );
  }

  if (!submission) {
    return (
      <Container className="flex flex-col items-start gap-4 py-16">
        <h1 className="text-3xl font-extrabold text-foreground">{t(isNotFound ? "notFound" : "loadError")}</h1>
        {isError ? (
          <Link className="font-semibold text-primary underline" href="/my-submissions">
            {t("back")}
          </Link>
        ) : null}
      </Container>
    );
  }

  return (
    <>
      <SubmissionHeader number={submission.number} status={submission.status} title={submission.title} type={submission.type} />
      <Container className="mt-8 flex max-w-4xl flex-col gap-6">
        <Link className="inline-flex items-center gap-2 font-semibold text-primary underline" href="/my-submissions">
          <ArrowLeft aria-hidden="true" className="size-4" />
          {t("back")}
        </Link>
        {justCreated ? <CreatedBanner number={submission.number} /> : null}
        <StatusTimeline submission={submission} />
        <Conversation isSending={isSending} replyError={replyError} sendReply={sendReply} submission={submission} />
        <LinkedInnovations items={submission.linkedInnovations} />
        <SubmissionFacts submission={submission} />
      </Container>
    </>
  );
}
