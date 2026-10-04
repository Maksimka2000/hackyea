"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/primitives/Button";

import type { CanvasBoard, PlanContent, PlanRow } from "../types/canvas";

import { PlanRowFields } from "./PlanRowFields";

type PlanBoardProps = Readonly<{
  board: CanvasBoard;
  value: PlanContent | undefined;
  onChange: (value: PlanContent) => void;
}>;

const emptyRow: PlanRow = { action: "", from: "", to: "", cost: null };

/** The action plan, phase by phase: rows of what, from/to month and cost. */
export function PlanBoard({ board, onChange, value }: PlanBoardProps) {
  const t = useTranslations("Canvas.plan");
  const plan = value ?? {};

  const setRows = (phase: string, rows: PlanRow[]) => onChange({ ...plan, [phase]: rows });

  return (
    <div className="flex flex-col gap-6">
      {board.periods ? (
        <p className="text-sm text-muted">
          {board.periods.map((period) => t("limit", { title: period.title, months: period.maxMonths })).join(" · ")}
        </p>
      ) : null}
      {(board.phases ?? []).map((phase) => {
        const rows = plan[phase.key] ?? [];
        return (
          <fieldset className="flex flex-col gap-3" key={phase.key}>
            <legend className="mb-1 font-bold text-foreground">{phase.title}</legend>
            {phase.hint ? <p className="text-sm text-muted">{phase.hint}</p> : null}
            {rows.map((row, index) => (
              <PlanRowFields
                id={`${board.key}-${phase.key}-${index}`}
                index={index}
                key={index}
                onChange={(next) => setRows(phase.key, rows.map((current, i) => (i === index ? next : current)))}
                onRemove={() => setRows(phase.key, rows.filter((_, i) => i !== index))}
                row={row}
              />
            ))}
            <Button className="self-start" onClick={() => setRows(phase.key, [...rows, emptyRow])} variant="outline">
              <Plus aria-hidden="true" className="size-5" />
              {t("addRow", { phase: phase.title })}
            </Button>
          </fieldset>
        );
      })}
    </div>
  );
}
