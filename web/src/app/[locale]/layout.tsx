import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Figtree } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { resolveLocale } from "@/i18n/resolve-locale";
import { routing } from "@/i18n/routing";
import { ACCESSIBILITY_COOKIE, parseAccessibilitySettings } from "@/shared/lib/accessibility/accessibility-settings";
import { AppProviders } from "@/shared/providers/AppProviders";

import "../globals.css";

const figtree = Figtree({
  subsets: ["latin", "latin-ext"],
  variable: "--font-figtree",
  display: "swap",
});

type LocaleLayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Pick<LocaleLayoutProps, "params">): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: { default: t("title"), template: `%s | ${t("siteName")}` },
    description: t("description"),
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const locale = resolveLocale((await params).locale);

  setRequestLocale(locale);

  // Saved text size and contrast come from a cookie, so the first paint already uses them (no script, no flash).
  const { contrast, textSize } = parseAccessibilitySettings((await cookies()).get(ACCESSIBILITY_COOKIE)?.value);

  return (
    <html className={figtree.variable} data-contrast={contrast} data-text-size={textSize} lang={locale}>
      <body>
        <NextIntlClientProvider>
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
