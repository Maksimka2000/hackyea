"use client";

import { useTranslations } from "next-intl";

import { textSizeOptions } from "@/shared/constants/accessibility";
import { useAccessibilitySettings } from "@/shared/hooks/useAccessibilitySettings";
import { cn } from "@/shared/lib/cn";

import { headerToggleClasses } from "./header-toggle-styles";

export function TextSizeControl() {
  const t = useTranslations("Accessibility");
  const { textSize, setTextSize } = useAccessibilitySettings();

  return (
    <div aria-label={t("textSizeLabel")} className="flex items-center gap-1" role="group">
      {textSizeOptions.map((option) => (
        <button
          aria-label={t(`textSize.${option.value}`)}
          aria-pressed={textSize === option.value}
          className={cn(headerToggleClasses, "font-semibold")}
          key={option.value}
          onClick={() => setTextSize(option.value)}
          type="button"
        >
          <span aria-hidden="true" className={option.glyphClassName}>
            A
          </span>
        </button>
      ))}
    </div>
  );
}
