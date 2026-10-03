import { useTranslations } from "next-intl";

export function LibraryEmpty() {
  const t = useTranslations("Library.empty");

  return (
    <div className="flex flex-col gap-2" role="status">
      <h2 className="text-2xl font-extrabold text-foreground">{t("title")}</h2>
      <p className="max-w-xl text-muted">{t("text")}</p>
    </div>
  );
}
