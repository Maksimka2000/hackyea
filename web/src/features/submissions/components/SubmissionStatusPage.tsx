import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { ButtonLink } from "@/shared/ui/primitives/ButtonLink";
import { Container } from "@/shared/ui/primitives/Container";

import { getSubmissionStatus } from "../api/getSubmissionStatus";

import { CreatedBanner } from "./CreatedBanner";
import { StaffReply } from "./StaffReply";
import { StatusHeader } from "./StatusHeader";
import { StatusTimeline } from "./StatusTimeline";
import { SubmissionSummary } from "./SubmissionSummary";

type SubmissionStatusPageProps = Readonly<{
  token: string;
  /** True right after sending: shows the confirmation banner with the private link. */
  justCreated: boolean;
}>;

export async function SubmissionStatusPage({ justCreated, token }: SubmissionStatusPageProps) {
  const submission = await getSubmissionStatus(token);

  if (!submission) {
    notFound();
  }

  const t = await getTranslations("SubmissionStatus");

  return (
    <>
      <StatusHeader submission={submission} />
      <Container className="mt-8 flex max-w-4xl flex-col gap-6">
        {justCreated ? <CreatedBanner /> : null}
        <StatusTimeline submission={submission} />
        <StaffReply reply={submission.reply} />
        <SubmissionSummary submission={submission} />
        <div>
          <ButtonLink href="/submit?type=need" variant="outline">
            {t("newSubmission")}
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
