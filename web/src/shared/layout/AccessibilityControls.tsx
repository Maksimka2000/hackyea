import { useTranslations } from "next-intl";

import { ContrastToggle } from "./ContrastToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { TextSizeControl } from "./TextSizeControl";

function Divider() {
  return <span aria-hidden="true" className="hidden h-6 w-px bg-hero-foreground/35 sm:block" />;
}

export function AccessibilityControls() {
  const t = useTranslations("Accessibility");

  return (
    <div aria-label={t("groupLabel")} className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3" role="group">
      <TextSizeControl />
      <Divider />
      <ContrastToggle />
      <Divider />
      <LanguageSwitcher />
    </div>
  );
}
