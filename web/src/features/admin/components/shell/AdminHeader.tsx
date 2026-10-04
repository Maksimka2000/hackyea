import { useTranslations } from "next-intl";

import { AccountControls } from "@/shared/account/AccountControls";
import { AccessibilityControls } from "@/shared/layout/AccessibilityControls";
import { SiteBrand } from "@/shared/layout/SiteBrand";

export function AdminHeader() {
  const t = useTranslations("Admin");

  return (
    <header className="on-dark bg-hero text-hero-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="flex flex-wrap items-center gap-4">
          <SiteBrand />
          <span className="rounded-full bg-accent px-3 py-1 text-sm font-extrabold text-accent-foreground">{t("badge")}</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <AccessibilityControls />
          <AccountControls />
        </div>
      </div>
    </header>
  );
}
