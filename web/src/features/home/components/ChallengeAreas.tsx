import { useTranslations } from "next-intl";

import { Container } from "@/shared/ui/primitives/Container";
import { SectionHeading } from "@/shared/ui/primitives/SectionHeading";

import { challengeAreas } from "@/shared/constants/challenge-areas";

import { ChallengeAreaCard } from "./ChallengeAreaCard";

export function ChallengeAreas() {
  const t = useTranslations("Home.areas");
  const tAreas = useTranslations("ChallengeAreas");

  return (
    <section aria-labelledby="challenge-areas-title" className="mt-20">
      <Container>
        <SectionHeading description={t("description")} id="challenge-areas-title" title={t("title")} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {challengeAreas.map((area) => (
            <li key={area.key}>
              <ChallengeAreaCard
                description={tAreas(`${area.key}.text`)}
                href={`/library?area=${area.slug}`}
                icon={area.icon}
                name={tAreas(`${area.key}.name`)}
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
