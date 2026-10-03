import { useTranslations } from "next-intl";

import { Container } from "@/shared/ui/primitives/Container";

import { HeroDecoration } from "./HeroDecoration";

export function HomeHero() {
  const t = useTranslations("Home.hero");

  return (
    <section aria-labelledby="home-hero-title" className="on-dark relative overflow-x-clip bg-hero pt-8 pb-32 text-hero-foreground">
      <HeroDecoration />
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
