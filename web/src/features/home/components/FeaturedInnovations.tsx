import { useTranslations } from "next-intl";

import { InnovationCard } from "@/shared/ui/composite/InnovationCard";
import { Container } from "@/shared/ui/primitives/Container";
import { SectionHeading } from "@/shared/ui/primitives/SectionHeading";

import type { FeaturedInnovation } from "../types/featured-innovation";

type FeaturedInnovationsProps = Readonly<{
  innovations: FeaturedInnovation[];
}>;

export function FeaturedInnovations({ innovations }: FeaturedInnovationsProps) {
  const t = useTranslations("Home.featured");

  return (
    <section aria-labelledby="featured-innovations-title" className="mt-20">
      <Container>
        <SectionHeading description={t("description")} id="featured-innovations-title" title={t("title")} />
        <ul className="grid gap-6 md:grid-cols-3">
          {innovations.map((innovation) => (
            <li key={innovation.id}>
              <InnovationCard {...innovation} viewLabel={t("viewSolution")} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
