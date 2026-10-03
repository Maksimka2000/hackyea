import { useTranslations } from "next-intl";

import type { InnovationSection } from "../types/innovation-detail";

import { EvidenceBlock } from "./EvidenceBlock";
import { SectionBlock } from "./SectionBlock";

type InnovationSectionsProps = Readonly<{
  sections: InnovationSection[];
}>;

export function InnovationSections({ sections }: InnovationSectionsProps) {
  const t = useTranslations("InnovationDetail");

  return (
    <div className="flex flex-col gap-10">
      {sections.map((section) =>
        section.key === "evidence" ? (
          <EvidenceBlock
            key={section.key}
            missingText={t("missingEvidence")}
            paragraphs={section.paragraphs}
            title={t(`sections.${section.key}`)}
          />
        ) : (
          <SectionBlock
            key={section.key}
            missingText={t("missingSection")}
            paragraphs={section.paragraphs}
            title={t(`sections.${section.key}`)}
          />
        ),
      )}
    </div>
  );
}
