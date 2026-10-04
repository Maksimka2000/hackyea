"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { useRouter } from "@/i18n/navigation";
import { safeReturnTo } from "@/shared/account/useSignInHref";
import { isApiError } from "@/shared/lib/api-error";
import { saveAuthSession } from "@/shared/lib/auth-session";

import { login, type LoginPortal } from "../api/authApi";
import { loginFormSchema, type LoginFormValues } from "../schemas/authDtoSchema";

export type LoginErrorKind = "invalid" | "wrongPortal" | "rateLimited" | "generic";

/** Sign-in form state; on success stores the session and returns to the page that asked for it. */
export function useLoginForm(portal: LoginPortal) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const returnTo = safeReturnTo(useSearchParams().get("returnTo"), portal === "admin" ? "/admin" : "/my-submissions");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { login: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: LoginFormValues) => login(portal, values),
    onSuccess: (session) => {
      queryClient.clear();
      saveAuthSession(session);
      router.push(returnTo);
    },
  });

  let errorKind: LoginErrorKind | null = null;
  if (mutation.isError) {
    const error = mutation.error;
    errorKind = isApiError(error, 401)
      ? "invalid"
      : isApiError(error, 403)
        ? "wrongPortal"
        : isApiError(error, 429)
          ? "rateLimited"
          : "generic";
  }

  return {
    form,
    onSubmit: form.handleSubmit((values) => mutation.mutate(values)),
    isSending: mutation.isPending || mutation.isSuccess,
    errorKind,
  };
}
