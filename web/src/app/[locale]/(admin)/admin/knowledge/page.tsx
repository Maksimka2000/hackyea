import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AdminKnowledgePage, knowledgeTabs, type KnowledgeTab } from "@/features/admin";
import { resolveLocale } from "@/i18n/resolve-locale";

type PageProps = Readonly<{
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string | string[] }>;
}>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: resolveLocale((await params).locale), namespace: "Admin.knowledge" });
  return { title: t("title") };
}

export default async function Page({ params, searchParams }: PageProps) {
  setRequestLocale(resolveLocale((await params).locale));
  const raw = (await searchParams).tab;
  const tab = knowledgeTabs.find((key) => key === (Array.isArray(raw) ? raw[0] : raw)) ?? "innovations";

  return <AdminKnowledgePage tab={tab as KnowledgeTab} />;
}
