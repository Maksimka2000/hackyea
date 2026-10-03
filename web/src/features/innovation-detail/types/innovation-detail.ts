import type { InnovationSectionKey } from "../constants/section-keys";

export type InnovationSection = {
  key: InnovationSectionKey;
  /** Empty when the library has no text for this section. */
  paragraphs: string[];
};

export type InnovationResources = {
  materialsUrl: string | null;
  detailsPdfUrl: string | null;
  videoUrl: string | null;
  licenseUrl: string | null;
};

/** What the detail page needs. Independent of the backend's field names. */
export type InnovationDetail = {
  id: string;
  title: string;
  summary: string;
  category: { id: string; name: string };
  sections: InnovationSection[];
  sourceUrl: string;
  resources: InnovationResources;
};

export type RelatedInnovation = {
  id: string;
  title: string;
  summary: string;
  categoryName: string;
};
