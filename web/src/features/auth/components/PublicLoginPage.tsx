"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/primitives/Button";
import { Card } from "@/shared/ui/primitives/Card";
import { Container } from "@/shared/ui/primitives/Container";

import { ProfilZaufanyScreen } from "./ProfilZaufanyScreen";

/** Sign-in for residents, NGOs and local governments: first the HubMI explanation, then the (simulated) trusted profile. */
export function PublicLoginPage() {
  const t = useTranslations("Auth.public");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <Container className="flex max-w-3xl flex-col gap-6 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{t("title")}</h1>
        <p className="text-lg text-muted">{t("lead")}</p>
      </div>
      {isProfileOpen ? (
        <ProfilZaufanyScreen />
      ) : (
        <Card className="flex flex-col items-start gap-4 p-6 sm:p-8">
          <ul className="list-disc pl-5 text-foreground">
            <li>{t("benefits.track")}</li>
            <li>{t("benefits.talk")}</li>
            <li>{t("benefits.canvas")}</li>
          </ul>
          <Button onClick={() => setIsProfileOpen(true)} size="lg">
            <ShieldCheck aria-hidden="true" className="size-5" />
            {t("profilZaufany")}
          </Button>
          <p className="text-sm text-muted">{t("noRegistration")}</p>
        </Card>
      )}
    </Container>
  );
}
