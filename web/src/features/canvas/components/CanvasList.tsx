"use client";

import { Plus, Trash2 } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/ui/primitives/Button";
import { Card } from "@/shared/ui/primitives/Card";
import { Skeleton } from "@/shared/ui/primitives/Skeleton";
import { Tag } from "@/shared/ui/primitives/Tag";

import { useMyCanvases } from "../hooks/useMyCanvases";

export function CanvasList() {
  const t = useTranslations("Canvas.list");
  const format = useFormatter();
  const { canvases, create, isCreating, isError, isLoading, remove, templates } = useMyCanvases();

  return (
    <div className="flex flex-col gap-6">
      {templates.map((template) => (
        <Card className="flex flex-col items-start gap-3 bg-tint p-6" key={template.key}>
          <h2 className="text-xl font-bold text-foreground">{template.title}</h2>
          <p className="text-muted">{template.description}</p>
          <p className="text-sm text-muted">{t("source", { source: template.source })}</p>
          <Button disabled={isCreating} onClick={() => create(template.key)}>
            <Plus aria-hidden="true" className="size-5" />
            {t("new")}
          </Button>
        </Card>
      ))}

      {isLoading ? <Skeleton className="h-32" /> : null}
      {isError ? (
        <p className="text-danger" role="alert">
          {t("loadError")}
        </p>
      ) : null}
      {canvases && canvases.length === 0 ? <p className="text-muted">{t("empty")}</p> : null}
      {canvases && canvases.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {canvases.map((canvas) => (
            <li key={canvas.id}>
              <Card className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div className="flex flex-col gap-1">
                  <Link className="text-lg font-bold text-primary underline" href={`/canvas/${canvas.id}`}>
                    {canvas.title}
                  </Link>
                  <span className="text-sm text-muted">
                    {t("updated", { date: format.dateTime(canvas.updatedAt, { dateStyle: "medium", timeStyle: "short" }) })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {canvas.submitted ? <Tag>{t("submitted")}</Tag> : null}
                  <Button aria-label={t("delete", { title: canvas.title })} onClick={() => remove(canvas.id)} variant="outline">
                    <Trash2 aria-hidden="true" className="size-5" />
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
