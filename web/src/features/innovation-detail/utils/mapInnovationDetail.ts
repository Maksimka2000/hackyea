import { innovationSectionKeys } from "../constants/section-keys";
import type { InnovationDto } from "../schemas/innovationDtoSchema";
import type { InnovationDetail, RelatedInnovation } from "../types/innovation-detail";

import { splitParagraphs } from "./splitParagraphs";

export function mapInnovationDetail(dto: InnovationDto): InnovationDetail {
  const texts: Record<(typeof innovationSectionKeys)[number], string | null> = {
    solution: dto.solution,
    problems: dto.problems,
    targetGroup: dto.targetGroup,
    beneficiaries: dto.beneficiaries,
    evidence: dto.evidence,
  };

  return {
    id: dto.id,
    title: dto.title,
    summary: dto.tagline ?? "",
    category: dto.category,
    sections: innovationSectionKeys.map((key) => ({ key, paragraphs: splitParagraphs(texts[key]) })),
    sourceUrl: dto.sourceUrl,
    resources: {
      materialsUrl: dto.links.materials,
      detailsPdfUrl: dto.links.detailsPdf,
      videoUrl: dto.links.video,
      licenseUrl: dto.links.license,
    },
  };
}

export function mapRelatedInnovation(dto: InnovationDto): RelatedInnovation {
  return {
    id: dto.id,
    title: dto.title,
    summary: dto.tagline ?? "",
    categoryName: dto.category.name,
  };
}
