import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { MySubmissionPage } from "@/features/submissions";
import { resolveLocale } from "@/i18n/resolve-locale";

type PageProps = Readonly<{
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ created?: string | string[] }>;
}>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: resolveLocale((await params).locale), namespace: "MySubmission" });
  return { title: t("metaTitle"), robots: { index: false, follow: false } };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id, locale } = await params;
  setRequestLocale(resolveLocale(locale));

  return <MySubmissionPage id={id} justCreated={(await searchParams).created === "1"} />;
}
