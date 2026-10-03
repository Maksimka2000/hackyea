import { useTranslations } from "next-intl";

import { LIBRARY_INNOVATION_COUNT } from "../constants/library-stats";

export function LibraryNote() {
  const t = useTranslations("Home");

  return (
    <p className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-muted">
      <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
      {t("libraryNote", { count: LIBRARY_INNOVATION_COUNT })}
    </p>
  );
}
