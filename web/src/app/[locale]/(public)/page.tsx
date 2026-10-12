import { setRequestLocale } from "next-intl/server";

import { HomePage } from "@/features/home";
import { resolveLocale } from "@/i18n/resolve-locale";

type PageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

// Featured innovations come from the API at request time, including on the first deployment.
export const dynamic = "force-dynamic";

export default async function Page({ params }: PageProps) {
  setRequestLocale(resolveLocale((await params).locale));

  return <HomePage />;
}
