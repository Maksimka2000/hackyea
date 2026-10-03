/** Reading order of the library's own sections; titles live in messages (`InnovationDetail.sections.<key>`). */
export const innovationSectionKeys = ["solution", "problems", "targetGroup", "beneficiaries", "evidence"] as const;

export type InnovationSectionKey = (typeof innovationSectionKeys)[number];
