import { useTranslations } from "next-intl";

import { Container } from "@/shared/ui/primitives/Container";
import { SectionHeading } from "@/shared/ui/primitives/SectionHeading";

import { howItWorksStepKeys } from "../constants/how-it-works-step-keys";

import { StepCard } from "./StepCard";

export function HowItWorks() {
  const t = useTranslations("Home.howItWorks");

  return (
    <section aria-labelledby="how-it-works-title" className="mt-20">
      <Container>
        <SectionHeading description={t("description")} id="how-it-works-title" title={t("title")} />
        <ol className="grid gap-6 md:grid-cols-3">
          {howItWorksStepKeys.map((key, index) => (
            <li key={key}>
              <StepCard
                hasConnector={index < howItWorksStepKeys.length - 1}
                position={index + 1}
                text={t(`steps.${key}.text`)}
                title={t(`steps.${key}.title`)}
              />
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
