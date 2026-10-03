"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { useRouter } from "@/i18n/navigation";
import { PROBLEM_MAX_LENGTH, PROBLEM_MIN_LENGTH } from "@/shared/constants/problem-limits";
import { saveProblemText } from "@/shared/lib/problem-session";
import { isProblemErrorKey, problemSchema, type ProblemFormValues } from "@/shared/validation/problemSchema";

const PROBLEM_FIELD = "problem";
const RESULTS_PATH = "/search";

export function useProblemForm() {
  const router = useRouter();

  const { control, formState, handleSubmit, register, setFocus, setValue } = useForm<ProblemFormValues>({
    resolver: zodResolver(problemSchema),
    defaultValues: { problem: "" },
  });

  const problemText = useWatch({ control, name: PROBLEM_FIELD });
  const errorMessage = formState.errors.problem?.message;

  // The text is handed over through session storage, never the URL (it may contain personal details).
  const onSubmit = handleSubmit((values) => {
    saveProblemText(values.problem);
    router.push(RESULTS_PATH);
  });

  const applyExample = (text: string) => {
    setValue(PROBLEM_FIELD, text, { shouldDirty: true });
    setFocus(PROBLEM_FIELD);
  };

  return {
    problemField: register(PROBLEM_FIELD),
    errorKey: isProblemErrorKey(errorMessage) ? errorMessage : undefined,
    characterCount: problemText.length,
    minLength: PROBLEM_MIN_LENGTH,
    maxLength: PROBLEM_MAX_LENGTH,
    onSubmit,
    applyExample,
  };
}
