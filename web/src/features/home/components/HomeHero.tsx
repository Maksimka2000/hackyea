import { useTranslations } from "next-intl";

import { Container } from "@/shared/ui/primitives/Container";

export function HomeHero() {
  const t = useTranslations("Home.hero");

  return (
    <section aria-labelledby="home-hero-title" className="on-dark relative overflow-hidden bg-hero pt-8 pb-32 text-hero-foreground">
      <div
        aria-hidden="true"
        className="contrast-high:hidden pointer-events-none absolute -top-32 -right-32 size-120 rounded-full border-2 border-hero-foreground/20 shadow-[0_0_0_3rem] shadow-hero-foreground/5"
      />
      <Container className="relative">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl" id="home-hero-title">
            {t.rich("title", {
              highlight: (chunks) => <em className="text-accent not-italic">{chunks}</em>,
            })}
          </h1>
          <p className="mt-4 max-w-3xl text-lg opacity-90">{t("lead")}</p>
        </div>
      </Container>
    </section>
  );
}
