"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { libraryCategories } from "@/shared/constants/library-categories";
import { Button } from "@/shared/ui/primitives/Button";
import { Card } from "@/shared/ui/primitives/Card";

import { useAdminChallenges, usePublicationActions } from "../../hooks/useKnowledgeAdmin";
import type { AdminChallenge } from "../../schemas/adminDtoSchemas";
import { QueryState } from "../shell/QueryState";
import { ActionError } from "../submission/ActionError";

import { ChallengeForm } from "./ChallengeForm";
import { PublicationActions } from "./PublicationActions";
import { PublicationBadge } from "./PublicationBadge";

/** Challenges of the Social Challenges Map: list, inline editor, publication flow. */
export function ChallengesTab() {
  const t = useTranslations("Admin.knowledge.challenges");
  const { isSaving, query, save, saveError } = useAdminChallenges();
  const actions = usePublicationActions("challenges");
  const [editing, setEditing] = useState<AdminChallenge | "new" | null>(null);
  const categoryName = (id: string | null) => libraryCategories.find((category) => category.id === id)?.name;

  return (
    <div className="flex flex-col gap-4">
      <Button className="self-end" onClick={() => setEditing("new")}>
        <Plus aria-hidden="true" className="size-5" />
        {t("new")}
      </Button>
      {editing ? (
        <ChallengeForm
          error={saveError}
          initial={editing === "new" ? null : editing}
          isSaving={isSaving}
          onCancel={() => setEditing(null)}
          onSave={async (body) => {
            if (await save(editing === "new" ? null : editing.id, body)) setEditing(null);
          }}
        />
      ) : null}
      <ActionError error={actions.error} />
      <QueryState isError={query.isError} isPending={query.isPending} />
      <ul className="flex flex-col gap-3">
        {(query.data ?? []).map((challenge) => (
          <li key={challenge.id}>
            <Card className="flex flex-col gap-2 p-5">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-bold text-foreground">{challenge.title}</h2>
                <PublicationBadge status={challenge.status} />
                {categoryName(challenge.categoryId) ? <span className="text-sm text-muted">{categoryName(challenge.categoryId)}</span> : null}
              </div>
              <p className="line-clamp-3 text-foreground">{challenge.description}</p>
              <div className="flex flex-wrap gap-2">
                <Button className="px-3 py-2" onClick={() => setEditing(challenge)} variant="outline">
                  {t("edit")}
                </Button>
                <PublicationActions
                  isPending={actions.isPending}
                  itemTitle={challenge.title}
                  onDelete={() => actions.remove(challenge.id)}
                  onStep={(step) => actions.run(challenge.id, step)}
                  status={challenge.status}
                />
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
