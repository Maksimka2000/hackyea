import { z } from "zod";

import { stripMarkup } from "@/shared/lib/strip-markup";
import { PROBLEM_MAX_LENGTH, PROBLEM_MIN_LENGTH } from "@/shared/constants/problem-limits";

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
    // Text made only of markup (for example `<a><b>`) is empty for the backend, so it counts as too short here.
    .refine((value) => stripMarkup(value).length >= PROBLEM_MIN_LENGTH, { message: "tooShort" satisfies ProblemErrorKey })
    .max(PROBLEM_MAX_LENGTH, { message: "tooLong" satisfies ProblemErrorKey }),
});

export type ProblemFormValues = z.infer<typeof problemSchema>;
