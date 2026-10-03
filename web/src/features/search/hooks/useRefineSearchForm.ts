"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { PROBLEM_MAX_LENGTH, PROBLEM_MIN_LENGTH } from "@/shared/constants/problem-limits";
import { saveProblemText } from "@/shared/lib/problem-session";
import { isProblemErrorKey, problemSchema, type ProblemFormValues } from "@/shared/validation/problemSchema";

import { useSavedProblem } from "@/shared/hooks/useSavedProblem";

const PROBLEM_FIELD = "problem";

export function useRefineSearchForm() {
  const savedProblem = useSavedProblem();

  const { control, formState, handleSubmit, register } = useForm<ProblemFormValues>({
    resolver: zodResolver(problemSchema),
    // Keeps the field in sync with the saved text (it arrives after hydration).
    values: { problem: savedProblem ?? "" },
  });

  const problemText = useWatch({ control, name: PROBLEM_FIELD });
  const errorMessage = formState.errors.problem?.message;

  const onSubmit = handleSubmit((values) => saveProblemText(values.problem));

  return {
    problemField: register(PROBLEM_FIELD),
    errorKey: isProblemErrorKey(errorMessage) ? errorMessage : undefined,
    characterCount: problemText.length,
    minLength: PROBLEM_MIN_LENGTH,
    maxLength: PROBLEM_MAX_LENGTH,
    onSubmit,
  };
}
