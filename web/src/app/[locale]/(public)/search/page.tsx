import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SearchPage } from "@/features/search";
import { resolveLocale } from "@/i18n/resolve-locale";

type PageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Search" });

  return { title: t("metaTitle") };
}

export default async function Page({ params }: PageProps) {
  setRequestLocale(resolveLocale((await params).locale));

  return <SearchPage />;
}
