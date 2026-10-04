"use client";

import { FlaskConical } from "lucide-react";
import { useTranslations } from "next-intl";

import { useSignInHref } from "@/shared/account/useSignInHref";
import { Link } from "@/i18n/navigation";
import { Card } from "@/shared/ui/primitives/Card";

import { useInnovationTester } from "../hooks/useInnovationTester";

import { FeedbackForm } from "./FeedbackForm";
import { RatingSummaryView } from "./RatingSummaryView";
import { StarRatingInput } from "./StarRatingInput";

type InnovationTesterProps = Readonly<{
  innovationId: string;
  innovationTitle: string;
}>;

/** "Tester innowacji" on a library card: rate the solution, give feedback, propose an improvement. */
export function InnovationTester({ innovationId, innovationTitle }: InnovationTesterProps) {
  const t = useTranslations("Tester");
  const signInHref = useSignInHref();
  const tester = useInnovationTester(innovationId);

  return (
    <Card className="flex flex-col gap-5 p-5">
      <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
        <FlaskConical aria-hidden="true" className="size-5 text-primary" />
        {t("title")}
      </h2>
      <RatingSummaryView summary={tester.summary} />
      {tester.canParticipate ? (
        <>
          <StarRatingInput
            disabled={tester.isRating}
            failed={tester.rateFailed}
            innovationTitle={innovationTitle}
            onRate={tester.rate}
            value={tester.summary?.myStars ?? null}
          />
          <FeedbackForm
            failed={tester.feedbackFailed}
            isSending={tester.isSendingFeedback}
            onSend={tester.sendFeedback}
            sentKind={tester.feedbackSentKind}
          />
        </>
      ) : tester.isStaff ? null : (
        <p className="text-sm text-muted">
          <Link className="font-semibold text-primary underline" href={signInHref}>
            {t("signIn")}
          </Link>{" "}
          {t("signInSuffix")}
        </p>
      )}
    </Card>
  );
}
