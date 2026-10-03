import { innovationSectionKeys } from "../constants/section-keys";
import type { InnovationDto, RelatedInnovationDto } from "../schemas/innovationDtoSchema";
import type { InnovationDetail, RelatedInnovation } from "../types/innovation-detail";

import { splitParagraphs } from "@/shared/lib/split-paragraphs";

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
    badge: dto.disseminationBadge ?? null,
    sections: innovationSectionKeys.map((key) => ({ key, paragraphs: splitParagraphs(texts[key]) })),
    sourceUrl: dto.sourceUrl,
    resources: {
      materialsUrl: dto.materialsUrl,
      detailsPdfUrl: dto.detailsPdfUrl,
      videoUrl: dto.videoUrl,
      licenseUrl: dto.licenseUrl,
    },
  };
}

export function mapRelatedInnovation(dto: RelatedInnovationDto): RelatedInnovation {
  return {
    id: dto.id,
    title: dto.title,
    summary: dto.tagline ?? "",
    categoryName: dto.category.name,
  };
}
