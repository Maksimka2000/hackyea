import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LibraryPage } from "@/features/library";
import { resolveLocale } from "@/i18n/resolve-locale";

type PageProps = Readonly<{
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string | string[] }>;
}>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Library" });

  return { title: t("metaTitle") };
}

export default async function Page({ params, searchParams }: PageProps) {
  setRequestLocale(resolveLocale((await params).locale));
  const { category } = await searchParams;

  return <LibraryPage categoryId={Array.isArray(category) ? category[0] : category} />;
}
