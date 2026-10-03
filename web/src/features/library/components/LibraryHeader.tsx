import { useTranslations } from "next-intl";

import { Container } from "@/shared/ui/primitives/Container";

type LibraryHeaderProps = Readonly<{
  /** Name of the category being shown; undefined when the whole library is shown. */
  categoryName: string | undefined;
  count: number;
}>;

export function LibraryHeader({ categoryName, count }: LibraryHeaderProps) {
  const t = useTranslations("Library.header");

  return (
    <section aria-labelledby="library-title" className="on-dark bg-hero py-10 text-hero-foreground">
      <Container className="flex flex-col gap-3">
        <h1 className="max-w-4xl text-3xl font-extrabold tracking-tight text-balance sm:text-4xl" id="library-title">
          {categoryName ?? t("title")}
        </h1>
        <p className="max-w-3xl text-lg opacity-90">
          {categoryName ? t("categoryDescription", { count }) : t("description", { count })}
        </p>
      </Container>
    </section>
  );
}
