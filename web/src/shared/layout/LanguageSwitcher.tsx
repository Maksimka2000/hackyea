"use client";

import { useLocale, useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

import { headerToggleClasses } from "./header-toggle-styles";

export function LanguageSwitcher() {
  const t = useTranslations("Accessibility");
  const activeLocale = useLocale();
  const pathname = usePathname();

  return (
    <div aria-label={t("languageLabel")} className="flex items-center gap-1" role="group">
      {routing.locales.map((locale) => (
        <Link
          aria-current={locale === activeLocale ? "true" : undefined}
          className={headerToggleClasses}
          hrefLang={locale}
          href={pathname}
          key={locale}
          lang={locale}
          locale={locale}
          title={t(`languages.${locale}`)}
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
