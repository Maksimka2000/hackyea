import { useTranslations } from "next-intl";

import { Container } from "@/shared/ui/primitives/Container";

export function SearchHeader() {
  const t = useTranslations("Search.header");

  return (
    <section aria-labelledby="search-title" className="on-dark bg-hero py-6 text-hero-foreground">
      <Container>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl" id="search-title">
          {t("title")}
        </h1>
        <p className="mt-1 max-w-3xl opacity-90">{t("lead")}</p>
      </Container>
    </section>
  );
}
