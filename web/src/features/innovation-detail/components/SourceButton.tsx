import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

import { buttonClasses } from "@/shared/ui/primitives/button-styles";

type SourceButtonProps = Readonly<{
  href: string;
}>;

export function SourceButton({ href }: SourceButtonProps) {
  const t = useTranslations("InnovationDetail.panel");

  return (
    <a
      className={buttonClasses({ variant: "primary", className: "w-full" })}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {t("source")}
      <span className="sr-only"> ({t("opensInNewTab")})</span>
      <ExternalLink aria-hidden="true" className="size-4" />
    </a>
  );
}
