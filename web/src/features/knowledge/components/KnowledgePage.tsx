import { getTranslations } from "next-intl/server";

import { CalloutCard } from "@/shared/ui/composite/CalloutCard";
import { Container } from "@/shared/ui/primitives/Container";

import { getKnowledge } from "../api/getKnowledge";

import { ChallengeList } from "./ChallengeList";
import { MaterialList } from "./MaterialList";

/** Knowledge store: Małopolska challenges, educational materials and the canvas tool. */
export async function KnowledgePage() {
  const t = await getTranslations("Knowledge");
  const { challenges, materials } = await getKnowledge();

  return (
    <>
      <section aria-labelledby="knowledge-title" className="on-dark bg-hero py-8 text-hero-foreground">
        <Container>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl" id="knowledge-title">
            {t("title")}
          </h1>
          <p className="mt-2 max-w-3xl text-lg opacity-90">{t("lead")}</p>
        </Container>
      </section>
      <Container className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div className="flex flex-col gap-12">
          <ChallengeList challenges={challenges} />
          <MaterialList materials={materials} />
        </div>
        <aside aria-label={t("tools")} className="flex flex-col gap-6">
          <CalloutCard ctaLabel={t("canvas.cta")} href="/canvas" text={t("canvas.text")} title={t("canvas.title")} />
          <CalloutCard ctaLabel={t("submit.cta")} href="/submit?type=idea" text={t("submit.text")} title={t("submit.title")} />
        </aside>
      </Container>
    </>
  );
}
