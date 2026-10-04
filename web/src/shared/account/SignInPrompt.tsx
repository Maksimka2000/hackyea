"use client";

import { LogIn } from "lucide-react";
import { useTranslations } from "next-intl";

import { ButtonLink } from "@/shared/ui/primitives/ButtonLink";
import { Card } from "@/shared/ui/primitives/Card";
import { Container } from "@/shared/ui/primitives/Container";

import { useSignInHref } from "./useSignInHref";

type SignInPromptProps = Readonly<{
  portal: "public" | "admin";
  /** True when someone is signed in, but with an account that cannot open this page. */
  wrongAccount?: boolean;
}>;

export function SignInPrompt({ portal, wrongAccount = false }: SignInPromptProps) {
  const t = useTranslations("Account.signInPrompt");
  const href = useSignInHref(portal);
  const variant = portal === "admin" ? "admin" : "public";

  return (
    <Container className="max-w-2xl py-16">
      <Card className="flex flex-col items-start gap-4 p-8">
        <LogIn aria-hidden="true" className="size-10 text-primary" />
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">{t(`${variant}.title`)}</h1>
        <p className="text-lg text-muted">{wrongAccount ? t(`${variant}.wrongAccount`) : t(`${variant}.text`)}</p>
        <ButtonLink href={href} size="lg">
          {t(`${variant}.cta`)}
        </ButtonLink>
      </Card>
    </Container>
  );
}
