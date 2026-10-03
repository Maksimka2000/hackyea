import { z } from "zod";

import { PROBLEM_MAX_LENGTH, PROBLEM_MIN_LENGTH } from "../constants/problem-limits";

/** Validation messages are translation keys (`Home.search.errors.<key>`), resolved in the UI. */
export const problemErrorKeys = ["tooShort", "tooLong"] as const;

export type ProblemErrorKey = (typeof problemErrorKeys)[number];

export function isProblemErrorKey(value: unknown): value is ProblemErrorKey {
  return problemErrorKeys.some((key) => key === value);
}

export const problemSchema = z.object({
  problem: z
    .string()
    .trim()
    .min(PROBLEM_MIN_LENGTH, { message: "tooShort" satisfies ProblemErrorKey })
    .max(PROBLEM_MAX_LENGTH, { message: "tooLong" satisfies ProblemErrorKey }),
});

export type ProblemFormValues = z.infer<typeof problemSchema>;
