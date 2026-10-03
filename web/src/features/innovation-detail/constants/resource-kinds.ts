import { Download, FileText, PlayCircle, Scale, type LucideIcon } from "lucide-react";

/** Order the links appear in the panel; labels live in messages (`InnovationDetail.panel.resources.<kind>`). */
export const resourceKinds = ["video", "materials", "detailsPdf", "license"] as const;

export type ResourceKind = (typeof resourceKinds)[number];

export const resourceIcons: Record<ResourceKind, LucideIcon> = {
  video: PlayCircle,
  materials: Download,
  detailsPdf: FileText,
  license: Scale,
};
