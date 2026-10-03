import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

import { resourceIcons } from "../constants/resource-kinds";
import type { ResourceLink } from "../utils/buildResourceLinks";

type ResourceListProps = Readonly<{
  links: ResourceLink[];
}>;

export function ResourceList({ links }: ResourceListProps) {
  const t = useTranslations("InnovationDetail.panel");

  return (
    <ul className="flex flex-col gap-3">
      {links.map(({ href, kind }) => {
        const Icon = resourceIcons[kind];

        return (
          <li key={kind}>
            <a
              className="-m-2 flex items-start gap-3 rounded-control p-2 text-foreground hover:bg-tint"
              href={href}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon aria-hidden="true" className="mt-0.5 size-5 flex-none text-primary" />
              <span className="flex flex-col">
                <span className="font-bold text-primary underline underline-offset-4">
                  {t(`resources.${kind}.label`)}
                  <span className="sr-only"> ({t("opensInNewTab")})</span>
                </span>
                <span className="text-sm text-muted">{t(`resources.${kind}.hint`)}</span>
              </span>
              <ExternalLink aria-hidden="true" className="mt-1 ml-auto size-4 flex-none text-muted" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
