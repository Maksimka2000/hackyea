import { Share2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

export function SiteBrand() {
  const t = useTranslations("Layout");

  return (
    <Link className="flex items-center gap-3 text-lg font-extrabold text-hero-foreground" href="/">
      <span aria-hidden="true" className="grid size-10 place-items-center rounded-control bg-accent text-accent-foreground">
        <Share2 className="size-5" strokeWidth={2.4} />
      </span>
      <span className="flex flex-col leading-tight">
        {t("brandName")}
        <span className="text-xs font-medium opacity-80">{t("brandRegion")}</span>
      </span>
    </Link>
  );
}
