"use client";

import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card } from "@/shared/ui/primitives/Card";

import { useDemoAccounts } from "../hooks/useDemoAccounts";
import { useLoginForm } from "../hooks/useLoginForm";

import { DemoAccountPicker } from "./DemoAccountPicker";
import { LoginFields } from "./LoginFields";

/**
 * Stand-in for the national trusted-profile sign-in. It is clearly labelled as a simulation and uses the seeded demo
 * accounts; a real integration would replace this screen and keep the rest of the flow.
 */
export function ProfilZaufanyScreen() {
  const t = useTranslations("Auth.profilZaufany");
  const accounts = useDemoAccounts();
  const { errorKind, form, isSending, onSubmit } = useLoginForm("public");

  const pick = (login: string) => {
    form.setValue("login", login, { shouldValidate: true });
    form.setFocus("password");
  };

  return (
    <Card className="flex flex-col gap-6 p-6 sm:p-8">
      <div className="flex items-start gap-3">
        <ShieldCheck aria-hidden="true" className="size-9 flex-none text-primary" />
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{t("title")}</h2>
          <p className="font-semibold text-primary">{t("simulation")}</p>
        </div>
      </div>
      <DemoAccountPicker accounts={accounts} onPick={pick} />
      <LoginFields
        errorKind={errorKind}
        form={form}
        isSending={isSending}
        onSubmit={onSubmit}
        portal="public"
        submitLabel={t("submit")}
      />
    </Card>
  );
}
