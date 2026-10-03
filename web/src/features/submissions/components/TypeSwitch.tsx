import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";

import { submissionTypes, type SubmissionType } from "../constants/submission-types";

type TypeSwitchProps = Readonly<{
  current: SubmissionType;
}>;

/** Two links (not buttons) so the chosen type stays in the URL and works without JavaScript. */
export function TypeSwitch({ current }: TypeSwitchProps) {
  const t = useTranslations("Submit.typeSwitch");

  return (
    <nav aria-label={t("label")}>
      <ul className="border-line inline-flex overflow-hidden rounded-control border-border-strong">
        {submissionTypes.map((type) => (
          <li key={type}>
            <Link
              aria-current={type === current ? "page" : undefined}
              className={cn(
                "block px-6 py-3 font-bold transition-colors duration-150",
                type === current ? "bg-primary text-primary-foreground" : "bg-surface text-primary hover:bg-tint",
              )}
              href={`/submit?type=${type}`}
              scroll={false}
            >
              {t(type)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
