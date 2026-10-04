import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CanvasEditorPage } from "@/features/canvas";
import { resolveLocale } from "@/i18n/resolve-locale";

type PageProps = Readonly<{
  params: Promise<{ locale: string; id: string }>;
}>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: resolveLocale((await params).locale), namespace: "Canvas.editor" });
  return { title: t("metaTitle"), robots: { index: false, follow: false } };
}

export default async function Page({ params }: PageProps) {
  const { id, locale } = await params;
  setRequestLocale(resolveLocale(locale));

  return <CanvasEditorPage id={id} />;
}
