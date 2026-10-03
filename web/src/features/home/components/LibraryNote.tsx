import { useTranslations } from "next-intl";

type LibraryNoteProps = Readonly<{
  /** Number of solutions in the library. */
  count: number;
}>;

export function LibraryNote({ count }: LibraryNoteProps) {
  const t = useTranslations("Home");

  return (
    <p className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-muted">
      <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
      {t("libraryNote", { count })}
    </p>
  );
}
