export const submitterTypes = ["resident", "ngo", "government", "expert", "other"] as const;

export type SubmitterType = (typeof submitterTypes)[number];

export function isSubmitterType(value: unknown): value is SubmitterType {
  return submitterTypes.some((type) => type === value);
}
