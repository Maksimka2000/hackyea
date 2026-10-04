import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AdminLoginPage } from "@/features/auth";
import { resolveLocale } from "@/i18n/resolve-locale";

type PageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: resolveLocale((await params).locale), namespace: "Auth.admin" });
  return { title: t("title"), robots: { index: false, follow: false } };
}

export default async function Page({ params }: PageProps) {
  setRequestLocale(resolveLocale((await params).locale));

  return <AdminLoginPage />;
}
