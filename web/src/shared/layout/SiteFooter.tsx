import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { externalLinks } from "@/shared/config/navigation";
import { Container } from "@/shared/ui/primitives/Container";

const linkClasses = "inline-flex items-center gap-1.5 font-semibold text-primary underline underline-offset-4";

export function SiteFooter() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-line mt-24 border-x-0 border-b-0 border-border bg-tint">
      <Container className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-3">
          <p className="max-w-xl text-lg font-semibold text-foreground">{t("tagline")}</p>
          <p className="max-w-xl text-sm text-muted">{t("sourceNote")}</p>
        </div>
        <nav aria-label={t("linksTitle")} className="flex flex-col gap-3 text-sm">
          <p className="font-bold text-foreground">{t("linksTitle")}</p>
          <Link className={linkClasses} href="/accessibility">
            {t("accessibilityDeclaration")}
          </Link>
          <a className={linkClasses} href={externalLinks.rops} rel="noopener noreferrer" target="_blank">
            {t("ropsSite")}
            <ExternalLink aria-hidden="true" className="size-4" />
          </a>
        </nav>
      </Container>
      <Container className="pb-8 text-sm text-muted">{t("prototypeNote")}</Container>
    </footer>
  );
}
