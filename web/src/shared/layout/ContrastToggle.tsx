"use client";

import { Contrast } from "lucide-react";
import { useTranslations } from "next-intl";

import { useAccessibilitySettings } from "@/shared/hooks/useAccessibilitySettings";

import { headerToggleClasses } from "./header-toggle-styles";

export function ContrastToggle() {
  const t = useTranslations("Accessibility");
  const { contrast, setContrast } = useAccessibilitySettings();
  const isHighContrast = contrast === "high";

  return (
    <button
      aria-label={t("contrast")}
      aria-pressed={isHighContrast}
      className={headerToggleClasses}
      onClick={() => setContrast(isHighContrast ? "normal" : "high")}
      type="button"
    >
      <Contrast aria-hidden="true" className="size-4" />
      {t("contrastShort")}
    </button>
  );
}
