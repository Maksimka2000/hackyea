import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SubmissionStatusPage } from "@/features/submissions";
import { resolveLocale } from "@/i18n/resolve-locale";

type PageProps = Readonly<{
  params: Promise<{ locale: string; token: string }>;
  searchParams: Promise<{ created?: string | string[] }>;
}>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "SubmissionStatus" });

  // The page is private (reached only through its secret link), so keep it out of search engines.
  return { title: t("metaTitle"), robots: { index: false, follow: false } };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { locale, token } = await params;
  const { created } = await searchParams;
  setRequestLocale(resolveLocale(locale));

  return <SubmissionStatusPage justCreated={created === "1"} token={token} />;
}
