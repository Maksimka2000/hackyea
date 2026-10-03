import { resourceKinds, type ResourceKind } from "../constants/resource-kinds";
import type { InnovationResources } from "../types/innovation-detail";

export type ResourceLink = {
  kind: ResourceKind;
  href: string;
};

/** Lists only the resources the library actually provides, in display order. */
export function buildResourceLinks(resources: InnovationResources): ResourceLink[] {
  const hrefs: Record<ResourceKind, string | null> = {
    video: resources.videoUrl,
    materials: resources.materialsUrl,
    detailsPdf: resources.detailsPdfUrl,
    license: resources.licenseUrl,
  };

  return resourceKinds.flatMap((kind) => {
    const href = hrefs[kind];
    return href ? [{ kind, href }] : [];
  });
}
