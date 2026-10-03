import { useTranslations } from "next-intl";

import { cn } from "@/shared/lib/cn";

import { matchStrengthStyles, type MatchStrength } from "../constants/match-strengths";

const TOTAL_SEGMENTS = 3;

type StrengthBadgeProps = Readonly<{
  strength: MatchStrength;
}>;

/** Outlined label with icon and a small segmented bar: the tier is never conveyed by colour alone. */
export function StrengthBadge({ strength }: StrengthBadgeProps) {
  const t = useTranslations("Search.strength");
  const { badgeClassName, filledSegments, icon: Icon } = matchStrengthStyles[strength];

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-full border-2 px-3 py-0.5 text-sm font-bold",
        badgeClassName,
      )}
    >
      <Icon aria-hidden="true" className="size-4" />
      {t(`${strength}.label`)}
      <span aria-hidden="true" className="flex gap-0.5">
        {Array.from({ length: TOTAL_SEGMENTS }, (_, index) => (
          <span
            className={cn(
              "h-1.5 w-3 rounded-sm border border-current",
              index < filledSegments ? "bg-current" : "bg-transparent",
            )}
            key={index}
          />
        ))}
      </span>
    </span>
  );
}
