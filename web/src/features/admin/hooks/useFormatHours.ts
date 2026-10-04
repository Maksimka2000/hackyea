"use client";

import { useFormatter, useTranslations } from "next-intl";

/** Response times as "45 min", "5,5 h" or "3 dni" in the current language. */
export function useFormatHours() {
  const t = useTranslations("Admin.duration");
  const format = useFormatter();

  return (hours: number | null | undefined) => {
    if (hours === null || hours === undefined) {
      return t("none");
    }
    if (hours < 1) {
      return t("minutes", { value: Math.max(1, Math.round(hours * 60)) });
    }
    if (hours < 48) {
      return t("hours", { value: format.number(hours, { maximumFractionDigits: 1 }) });
    }
    return t("days", { value: format.number(hours / 24, { maximumFractionDigits: 1 }) });
  };
}
