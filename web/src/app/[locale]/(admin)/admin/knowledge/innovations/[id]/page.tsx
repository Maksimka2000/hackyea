import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { InnovationEditorPage } from "@/features/admin";
import { resolveLocale } from "@/i18n/resolve-locale";

type PageProps = Readonly<{
  params: Promise<{ locale: string; id: string }>;
}>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: resolveLocale((await params).locale), namespace: "Admin.knowledge.editor" });
  return { title: t("title") };
}

export default async function Page({ params }: PageProps) {
  const { id, locale } = await params;
  setRequestLocale(resolveLocale(locale));

  return <InnovationEditorPage id={id} />;
}
