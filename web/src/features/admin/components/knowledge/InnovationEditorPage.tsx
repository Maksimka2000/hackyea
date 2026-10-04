"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, useRouter } from "@/i18n/navigation";
import { Card } from "@/shared/ui/primitives/Card";

import { useInnovationEditor } from "../../hooks/useInnovationEditor";
import { usePublicationActions } from "../../hooks/useKnowledgeAdmin";
import { AdminPageHeader } from "../shell/AdminPageHeader";
import { QueryState } from "../shell/QueryState";
import { ActionError } from "../submission/ActionError";

import { InnovationForm } from "./InnovationForm";
import { PublicationActions } from "./PublicationActions";
import { PublicationBadge } from "./PublicationBadge";

type InnovationEditorPageProps = Readonly<{
  /** Null for a new card. */
  id: string | null;
}>;

export function InnovationEditorPage({ id }: InnovationEditorPageProps) {
  const t = useTranslations("Admin.knowledge.editor");
  const router = useRouter();
  const editor = useInnovationEditor(id);
  const actions = usePublicationActions("innovations");
  const card = editor.innovation;

  return (
    <div className="flex flex-col gap-6">
      <Link className="inline-flex items-center gap-2 font-semibold text-primary underline" href="/admin/knowledge?tab=innovations">
        <ArrowLeft aria-hidden="true" className="size-4" />
        {t("back")}
      </Link>
      <AdminPageHeader lead={id ? undefined : t("newLead")} title={id ? (card?.title ?? t("title")) : t("newTitle")} />
      <QueryState isError={editor.isError} isPending={editor.isLoading} />
      {card ? (
        <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <span className="font-bold text-foreground">{t("status")}</span>
            <PublicationBadge status={card.status} />
            {card.status === "published" ? (
              <Link className="font-semibold text-primary underline" href={`/library/${card.id}`}>
                {t("view")}
              </Link>
            ) : null}
          </div>
          <PublicationActions
            isPending={actions.isPending}
            itemTitle={card.title}
            onDelete={() => {
              actions.remove(card.id);
              router.push("/admin/knowledge?tab=innovations");
            }}
            onStep={(step) => actions.run(card.id, step)}
            status={card.status}
          />
          <ActionError error={actions.error} />
          <p className="basis-full text-sm text-muted">{t("flow")}</p>
        </Card>
      ) : null}
      {!id || card ? (
        <InnovationForm
          fieldError={editor.fieldError}
          initial={card}
          isSaving={editor.isSaving}
          onSave={editor.save}
          saved={editor.saved}
          saveError={editor.saveError}
        />
      ) : null}
    </div>
  );
}
