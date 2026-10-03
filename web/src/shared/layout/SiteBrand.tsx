import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

import { LogoMark } from "./LogoMark";

export function SiteBrand() {
  const t = useTranslations("Layout");

  return (
    <Link className="flex items-center gap-3 text-hero-foreground" href="/">
      <span aria-hidden="true" className="grid size-10 place-items-center rounded-control bg-accent text-accent-foreground">
        <LogoMark className="size-7" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-xl font-extrabold tracking-tight">{t("brandName")}</span>
        <span className="text-xs font-medium opacity-80">{t("brandDescriptor")}</span>
      </span>
    </Link>
  );
}
