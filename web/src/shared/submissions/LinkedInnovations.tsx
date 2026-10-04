import { Lightbulb } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Card } from "@/shared/ui/primitives/Card";

import type { SubmissionDetail } from "./submissionModel";

type LinkedInnovationsProps = Readonly<{
  items: SubmissionDetail["linkedInnovations"];
}>;

/** Library cards related to the submission: proposed by matching, seen by the submitter, or chosen by staff. */
export function LinkedInnovations({ items }: LinkedInnovationsProps) {
  const t = useTranslations("Submission.linked");

  return (
    <Card className="flex flex-col gap-3 p-6">
      <h2 className="flex items-center gap-2 text-xl font-extrabold text-foreground">
        <Lightbulb aria-hidden="true" className="size-6 text-primary" />
        {t("title")}
      </h2>
      {items.length === 0 ? (
        <p className="text-muted">{t("empty")}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li className="flex flex-wrap items-baseline gap-x-2" key={item.id}>
              <Link className="font-semibold text-primary underline" href={`/library/${item.id}`}>
                {item.title}
              </Link>
              <span className="text-sm text-muted">{t(`source.${item.source}`)}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
