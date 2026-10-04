"use client";

import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/shared/lib/cn";

const STARS = [1, 2, 3, 4, 5] as const;

type StarRatingInputProps = Readonly<{
  value: number | null;
  onRate: (stars: number) => void;
  disabled: boolean;
  failed: boolean;
  innovationTitle: string;
}>;

/** Native radio group (arrow keys work), drawn as stars; each option is named for screen readers. */
export function StarRatingInput({ disabled, failed, innovationTitle, onRate, value }: StarRatingInputProps) {
  const t = useTranslations("Tester.rate");

  return (
    <fieldset className="flex flex-col gap-2" disabled={disabled}>
      <legend className="mb-1 font-bold text-foreground">{t("legend")}</legend>
      <div className="flex gap-1">
        {STARS.map((stars) => (
          <label
            className="cursor-pointer rounded-control p-1 has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus"
            key={stars}
          >
            <input
              checked={value === stars}
              className="sr-only"
              name="innovation-rating"
              onChange={() => onRate(stars)}
              type="radio"
              value={stars}
            />
            <Star
              aria-hidden="true"
              className={cn("size-8", value !== null && stars <= value ? "fill-accent text-accent-foreground" : "text-muted")}
            />
            <span className="sr-only">{t("option", { count: stars, title: innovationTitle })}</span>
          </label>
        ))}
      </div>
      <p aria-live="polite" className="text-sm" role="status">
        {failed ? <span className="text-danger">{t("failed")}</span> : value ? <span className="text-muted">{t("yours", { count: value })}</span> : null}
      </p>
    </fieldset>
  );
}
