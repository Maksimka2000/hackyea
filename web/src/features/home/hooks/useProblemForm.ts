"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { PROBLEM_MAX_LENGTH, PROBLEM_MIN_LENGTH } from "../constants/problem-limits";
import { isProblemErrorKey, problemSchema, type ProblemFormValues } from "../schemas/problemSchema";

const PROBLEM_FIELD = "problem";

export function useProblemForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { control, formState, handleSubmit, register, setFocus, setValue } = useForm<ProblemFormValues>({
    resolver: zodResolver(problemSchema),
    defaultValues: { problem: "" },
  });

  const problemText = useWatch({ control, name: PROBLEM_FIELD });
  const errorMessage = formState.errors.problem?.message;

  // TODO: replace with navigation to the results page once the matching endpoint exists.
  const onSubmit = handleSubmit(() => setIsSubmitted(true));

  const applyExample = (text: string) => {
    setValue(PROBLEM_FIELD, text, { shouldDirty: true });
    setIsSubmitted(false);
    setFocus(PROBLEM_FIELD);
  };

  return {
    problemField: register(PROBLEM_FIELD),
    errorKey: isProblemErrorKey(errorMessage) ? errorMessage : undefined,
    characterCount: problemText.length,
    minLength: PROBLEM_MIN_LENGTH,
    maxLength: PROBLEM_MAX_LENGTH,
    isSubmitted,
    onSubmit,
    applyExample,
  };
}
