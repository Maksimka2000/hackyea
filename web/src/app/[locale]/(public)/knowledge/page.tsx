import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { KnowledgePage } from "@/features/knowledge";
import { resolveLocale } from "@/i18n/resolve-locale";

type PageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: resolveLocale((await params).locale), namespace: "Knowledge" });
  return { title: t("title") };
}

export default async function Page({ params }: PageProps) {
  setRequestLocale(resolveLocale((await params).locale));

  return <KnowledgePage />;
}
