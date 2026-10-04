import { BookOpen, ExternalLink, FileText, PlayCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { splitParagraphs } from "@/shared/lib/split-paragraphs";
import { Card } from "@/shared/ui/primitives/Card";
import { SectionHeading } from "@/shared/ui/primitives/SectionHeading";
import { Tag } from "@/shared/ui/primitives/Tag";

import type { Material } from "../schemas/knowledgeDtoSchema";

type MaterialListProps = Readonly<{
  materials: Material[];
}>;

const icons = { article: FileText, video: PlayCircle, guide: BookOpen } as const;

export function MaterialList({ materials }: MaterialListProps) {
  const t = useTranslations("Knowledge.materials");

  return (
    <section aria-labelledby="materials-title">
      <SectionHeading description={t("description")} id="materials-title" title={t("title")} />
      {materials.length === 0 ? <p className="text-muted">{t("empty")}</p> : null}
      <ul className="flex flex-col gap-4">
        {materials.map((material) => {
          const Icon = icons[material.type];
          return (
            <li key={material.id}>
              <Card className="flex flex-col gap-3 p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <Icon aria-hidden="true" className="size-6 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">{material.title}</h3>
                  <Tag>{t(`types.${material.type}`)}</Tag>
                </div>
                <p className="text-muted">{material.summary}</p>
                {material.body ? (
                  <details className="text-foreground">
                    <summary className="cursor-pointer font-semibold text-primary">{t("read", { title: material.title })}</summary>
                    <div className="mt-3 flex flex-col gap-3">
                      {splitParagraphs(material.body).map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </details>
                ) : null}
                {material.url ? (
                  <a className="inline-flex items-center gap-2 font-semibold text-primary underline" href={material.url} rel="noopener noreferrer" target="_blank">
                    {t("open", { title: material.title })}
                    <ExternalLink aria-hidden="true" className="size-4" />
                  </a>
                ) : null}
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
