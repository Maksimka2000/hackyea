import { useTranslations } from "next-intl";

import { libraryCategoryIcon } from "@/shared/constants/library-categories";
import { Card } from "@/shared/ui/primitives/Card";
import { SectionHeading } from "@/shared/ui/primitives/SectionHeading";

import type { Challenge } from "../schemas/knowledgeDtoSchema";

type ChallengeListProps = Readonly<{
  challenges: Challenge[];
}>;

export function ChallengeList({ challenges }: ChallengeListProps) {
  const t = useTranslations("Knowledge.challenges");

  return (
    <section aria-labelledby="challenges-title">
      <SectionHeading description={t("description")} id="challenges-title" title={t("title")} />
      {challenges.length === 0 ? <p className="text-muted">{t("empty")}</p> : null}
      <ul className="grid gap-4 sm:grid-cols-2">
        {challenges.map((challenge) => {
          const Icon = libraryCategoryIcon(challenge.categoryId ?? "");
          return (
            <li key={challenge.id}>
              <Card className="flex h-full flex-col gap-3 p-5">
                <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <Icon aria-hidden="true" className="size-6 flex-none text-primary" />
                  {challenge.title}
                </h3>
                <p className="text-foreground">{challenge.description}</p>
                {challenge.source ? <p className="mt-auto text-sm text-muted">{t("source", { source: challenge.source })}</p> : null}
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
