import { useTranslations } from "next-intl";

import { MAIN_CONTENT_ID } from "@/shared/constants/layout";

export function SkipLink() {
  const t = useTranslations("Layout");

  return (
    <a
      className="absolute top-4 left-4 z-50 -translate-y-24 rounded-control bg-accent px-4 py-2 font-bold text-accent-foreground focus:translate-y-0"
      href={`#${MAIN_CONTENT_ID}`}
    >
      {t("skipToContent")}
    </a>
  );
}
