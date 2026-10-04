"use client";

import { useTranslations } from "next-intl";

import { Card } from "@/shared/ui/primitives/Card";
import { Container } from "@/shared/ui/primitives/Container";

import { useLoginForm } from "../hooks/useLoginForm";

import { LoginFields } from "./LoginFields";

/** ROPS staff sign-in to the admin panel. Accounts are created by ROPS; there is no registration. */
export function AdminLoginPage() {
  const t = useTranslations("Auth.admin");
  const { errorKind, form, isSending, onSubmit } = useLoginForm("admin");

  return (
    <Container className="flex max-w-xl flex-col gap-6 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{t("title")}</h1>
        <p className="text-lg text-muted">{t("lead")}</p>
      </div>
      <Card className="p-6 sm:p-8">
        <LoginFields
          errorKind={errorKind}
          form={form}
          isSending={isSending}
          onSubmit={onSubmit}
          portal="admin"
          submitLabel={t("submit")}
        />
      </Card>
    </Container>
  );
}
