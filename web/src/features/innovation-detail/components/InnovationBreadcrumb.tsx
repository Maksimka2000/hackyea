import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

type InnovationBreadcrumbProps = Readonly<{
  categoryId: string;
  categoryName: string;
  title: string;
}>;

const linkClasses = "underline underline-offset-4 hover:text-accent";

export function InnovationBreadcrumb({ categoryId, categoryName, title }: InnovationBreadcrumbProps) {
  const t = useTranslations("InnovationDetail.breadcrumb");

  return (
    <nav aria-label={t("label")} className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 opacity-90">
        <li>
          <Link className={linkClasses} href="/library">
            {t("library")}
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="size-4" />
        </li>
        <li>
          <Link className={linkClasses} href={`/library?category=${categoryId}`}>
            {categoryName}
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="size-4" />
        </li>
        <li aria-current="page" className="font-semibold">
          {title}
        </li>
      </ol>
    </nav>
  );
}
