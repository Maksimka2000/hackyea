import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { getInnovation, InnovationDetailPage } from "@/features/innovation-detail";
import { resolveLocale } from "@/i18n/resolve-locale";

type PageProps = Readonly<{
  params: Promise<{ locale: string; id: string }>;
}>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id, locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const innovation = await getInnovation(id);

  if (!innovation) {
    const t = await getTranslations({ locale, namespace: "InnovationDetail" });
    return { title: t("metaNotFound") };
  }

  return { title: innovation.title, description: innovation.summary || undefined };
}

export default async function Page({ params }: PageProps) {
  const { id, locale } = await params;
  setRequestLocale(resolveLocale(locale));

  return <InnovationDetailPage id={id} />;
}
