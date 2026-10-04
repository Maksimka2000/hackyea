import { submissionTypes, type SubmissionType } from "@/shared/submissions/submissionModel";

export { submissionTypes, type SubmissionType };

export const DEFAULT_SUBMISSION_TYPE: SubmissionType = "need";

/** Only a local government (JST) account reports a local challenge. */
export const JST_ONLY_TYPES: ReadonlyArray<SubmissionType> = ["localChallenge"];

/** Reads the `?type=` value from the URL; anything unknown means the default. */
export function parseSubmissionType(value: unknown): SubmissionType {
  return submissionTypes.find((type) => type === value) ?? DEFAULT_SUBMISSION_TYPE;
}
