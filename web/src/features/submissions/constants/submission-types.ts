export const submissionTypes = ["need", "idea"] as const;

export type SubmissionType = (typeof submissionTypes)[number];

export const DEFAULT_SUBMISSION_TYPE: SubmissionType = "need";

/** Reads the `?type=` value from the URL; anything unknown means the default. */
export function parseSubmissionType(value: unknown): SubmissionType {
  return submissionTypes.find((type) => type === value) ?? DEFAULT_SUBMISSION_TYPE;
}
