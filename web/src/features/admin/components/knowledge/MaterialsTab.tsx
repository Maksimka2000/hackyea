"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/primitives/Button";
import { Card } from "@/shared/ui/primitives/Card";
import { Tag } from "@/shared/ui/primitives/Tag";

import { useAdminMaterials, usePublicationActions } from "../../hooks/useKnowledgeAdmin";
import type { AdminMaterial } from "../../schemas/adminDtoSchemas";
import { QueryState } from "../shell/QueryState";
import { ActionError } from "../submission/ActionError";

import { MaterialForm } from "./MaterialForm";
import { PublicationActions } from "./PublicationActions";
import { PublicationBadge } from "./PublicationBadge";

/** Educational materials: list, inline editor, publication flow. */
export function MaterialsTab() {
  const t = useTranslations("Admin.knowledge.materials");
  const { isSaving, query, save, saveError } = useAdminMaterials();
  const actions = usePublicationActions("materials");
  const [editing, setEditing] = useState<AdminMaterial | "new" | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <Button className="self-end" onClick={() => setEditing("new")}>
        <Plus aria-hidden="true" className="size-5" />
        {t("new")}
      </Button>
      {editing ? (
        <MaterialForm
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
        {(query.data ?? []).map((material) => (
          <li key={material.id}>
            <Card className="flex flex-col gap-2 p-5">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-bold text-foreground">{material.title}</h2>
                <PublicationBadge status={material.status} />
                <Tag>{t(`types.${material.type}`)}</Tag>
              </div>
              <p className="text-foreground">{material.summary}</p>
              <div className="flex flex-wrap gap-2">
                <Button className="px-3 py-2" onClick={() => setEditing(material)} variant="outline">
                  {t("edit")}
                </Button>
                <PublicationActions
                  isPending={actions.isPending}
                  itemTitle={material.title}
                  onDelete={() => actions.remove(material.id)}
                  onStep={(step) => actions.run(material.id, step)}
                  status={material.status}
                />
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
