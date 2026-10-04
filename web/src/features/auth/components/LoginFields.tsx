"use client";

import { LogIn } from "lucide-react";
import { useTranslations } from "next-intl";
import type { UseFormReturn } from "react-hook-form";

import { Button } from "@/shared/ui/primitives/Button";
import { FormField } from "@/shared/ui/primitives/FormField";
import { Input } from "@/shared/ui/primitives/Input";

import type { LoginErrorKind } from "../hooks/useLoginForm";
import type { LoginFormValues } from "../schemas/authDtoSchema";

import { LoginError } from "./LoginError";

type LoginFieldsProps = Readonly<{
  form: UseFormReturn<LoginFormValues>;
  onSubmit: () => void;
  isSending: boolean;
  errorKind: LoginErrorKind | null;
  portal: "public" | "admin";
  submitLabel: string;
}>;

export function LoginFields({ errorKind, form, isSending, onSubmit, portal, submitLabel }: LoginFieldsProps) {
  const t = useTranslations("Auth");
  const { errors } = form.formState;
  // Schema messages are keys under Auth.errors.
  const loginError = errors.login?.message as "loginRequired" | undefined;
  const passwordError = errors.password?.message as "passwordRequired" | undefined;

  return (
    <form className="flex flex-col gap-5" noValidate onSubmit={onSubmit}>
      <FormField error={loginError ? t(`errors.${loginError}`) : undefined} id={`${portal}-login`} label={t("fields.login")}>
        {(controlProps) => <Input autoComplete="username" {...controlProps} {...form.register("login")} />}
      </FormField>
      <FormField
        error={passwordError ? t(`errors.${passwordError}`) : undefined}
        id={`${portal}-password`}
        label={t("fields.password")}
      >
        {(controlProps) => (
          <Input autoComplete="current-password" type="password" {...controlProps} {...form.register("password")} />
        )}
      </FormField>
      {errorKind ? <LoginError kind={errorKind} portal={portal} /> : null}
      <Button className="self-start" disabled={isSending} size="lg" type="submit">
        <LogIn aria-hidden="true" className="size-5" />
        {isSending ? t("signingIn") : submitLabel}
      </Button>
    </form>
  );
}
