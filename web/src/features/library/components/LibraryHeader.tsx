import { useTranslations } from "next-intl";

import { Container } from "@/shared/ui/primitives/Container";

import { LibraryBreadcrumb } from "./LibraryBreadcrumb";

type LibraryHeaderProps = Readonly<{
  /** Name of the category being shown; undefined when the whole library is shown. */
  categoryName: string | undefined;
  count: number;
}>;

export function LibraryHeader({ categoryName, count }: LibraryHeaderProps) {
  const t = useTranslations("Library.header");

  return (
    <section aria-labelledby="library-title" className="on-dark bg-hero py-8 text-hero-foreground">
      <Container className="flex flex-col gap-3">
        {categoryName ? <LibraryBreadcrumb categoryName={categoryName} /> : null}
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl" id="library-title">
            {categoryName ?? t("title")}
          </h1>
          <p className="text-lg font-semibold opacity-90">{t("count", { count })}</p>
        </div>
      </Container>
    </section>
  );
}
