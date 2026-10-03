import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

type LibraryBreadcrumbProps = Readonly<{
  categoryName: string;
}>;

export function LibraryBreadcrumb({ categoryName }: LibraryBreadcrumbProps) {
  const t = useTranslations("Library.breadcrumb");

  return (
    <nav aria-label={t("label")} className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 opacity-90">
        <li>
          <Link className="underline underline-offset-4 hover:text-accent" href="/library">
            {t("library")}
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="size-4" />
        </li>
        <li aria-current="page" className="font-semibold">
          {categoryName}
        </li>
      </ol>
    </nav>
  );
}
