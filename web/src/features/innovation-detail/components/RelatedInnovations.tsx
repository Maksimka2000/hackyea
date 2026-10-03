import { useTranslations } from "next-intl";

import { InnovationCard } from "@/shared/ui/composite/InnovationCard";
import { Container } from "@/shared/ui/primitives/Container";
import { SectionHeading } from "@/shared/ui/primitives/SectionHeading";

import type { RelatedInnovation } from "../types/innovation-detail";

type RelatedInnovationsProps = Readonly<{
  items: RelatedInnovation[];
}>;

export function RelatedInnovations({ items }: RelatedInnovationsProps) {
  const t = useTranslations("InnovationDetail.related");

  return (
    <section aria-labelledby="related-innovations-title" className="mt-20">
      <Container>
        <SectionHeading description={t("description")} id="related-innovations-title" title={t("title")} />
        <ul className="grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <li key={item.id}>
              <InnovationCard {...item} viewLabel={t("viewSolution")} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
