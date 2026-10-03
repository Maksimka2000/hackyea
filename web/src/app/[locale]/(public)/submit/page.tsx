import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { parseSubmissionType, SubmitPage } from "@/features/submissions";
import { resolveLocale } from "@/i18n/resolve-locale";

type PageProps = Readonly<{
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string | string[] }>;
}>;

function readType(rawType: string | string[] | undefined) {
  return parseSubmissionType(Array.isArray(rawType) ? rawType[0] : rawType);
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const type = readType((await searchParams).type);
  const t = await getTranslations({ locale, namespace: "Submit.header" });

  return { title: t(`${type}.title`) };
}

export default async function Page({ params, searchParams }: PageProps) {
  setRequestLocale(resolveLocale((await params).locale));

  return <SubmitPage type={readType((await searchParams).type)} />;
}
