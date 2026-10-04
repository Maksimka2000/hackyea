"use client";

import { useTranslations } from "next-intl";

import { FormField } from "@/shared/ui/primitives/FormField";
import { Input } from "@/shared/ui/primitives/Input";

import type { SaveState } from "../types/canvas";

type CanvasToolbarProps = Readonly<{
  title: string;
  templateTitle: string;
  saveState: SaveState;
  saveError?: string;
  onTitleChange: (title: string) => void;
}>;

export function CanvasToolbar({ onTitleChange, saveError, saveState, templateTitle, title }: CanvasToolbarProps) {
  const t = useTranslations("Canvas.editor");

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-bold tracking-wide text-muted uppercase">{templateTitle}</p>
      <h1 className="sr-only">{title || templateTitle}</h1>
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-64 flex-1">
          <FormField id="canvas-title" label={t("titleLabel")}>
            {(controlProps) => <Input maxLength={200} onChange={(event) => onTitleChange(event.target.value)} value={title} {...controlProps} />}
          </FormField>
        </div>
        <p aria-live="polite" className="pb-3 text-sm font-semibold" role="status">
          {saveState === "saving" ? <span className="text-muted">{t("saving")}</span> : null}
          {saveState === "saved" ? <span className="text-primary">{t("saved")}</span> : null}
          {saveState === "error" ? <span className="text-danger">{saveError ?? t("saveError")}</span> : null}
        </p>
      </div>
    </div>
  );
}
