"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { useAuthSession } from "@/shared/hooks/useAuthSession";
import { cn } from "@/shared/lib/cn";

import { JST_ONLY_TYPES, submissionTypes, type SubmissionType } from "../constants/submission-types";

type TypeSwitchProps = Readonly<{
  current: SubmissionType;
}>;

/** Links (not buttons) so the chosen type stays in the URL. A local challenge is offered to local governments only. */
export function TypeSwitch({ current }: TypeSwitchProps) {
  const t = useTranslations("Submit.typeSwitch");
  const isJst = useAuthSession()?.user.role === "Jst";
  const types = submissionTypes.filter((type) => isJst || !JST_ONLY_TYPES.includes(type));

  return (
    <nav aria-label={t("label")}>
      <ul className="border-line inline-flex flex-wrap overflow-hidden rounded-control border-border-strong">
        {types.map((type) => (
          <li key={type}>
            <Link
              aria-current={type === current ? "page" : undefined}
              className={cn(
                "block px-5 py-3 font-bold transition-colors duration-150",
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
