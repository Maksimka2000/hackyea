"use client";

import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/primitives/Button";
import { Input } from "@/shared/ui/primitives/Input";

import type { PlanRow } from "../types/canvas";

type PlanRowFieldsProps = Readonly<{
  id: string;
  index: number;
  row: PlanRow;
  onChange: (row: PlanRow) => void;
  onRemove: () => void;
}>;

const labelClasses = "text-sm font-bold text-foreground";

export function PlanRowFields({ id, index, onChange, onRemove, row }: PlanRowFieldsProps) {
  const t = useTranslations("Canvas.plan");

  return (
    <div className="border-line grid gap-3 rounded-control border-border bg-tint p-3 sm:grid-cols-[1fr_9rem_9rem_8rem_auto] sm:items-end">
      <div className="flex flex-col gap-1">
        <label className={labelClasses} htmlFor={`${id}-action`}>
          {t("action", { number: index + 1 })}
        </label>
        <Input id={`${id}-action`} maxLength={500} onChange={(event) => onChange({ ...row, action: event.target.value })} value={row.action} />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClasses} htmlFor={`${id}-from`}>
          {t("from")}
        </label>
        <Input id={`${id}-from`} onChange={(event) => onChange({ ...row, from: event.target.value })} type="month" value={row.from} />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClasses} htmlFor={`${id}-to`}>
          {t("to")}
        </label>
        <Input id={`${id}-to`} onChange={(event) => onChange({ ...row, to: event.target.value })} type="month" value={row.to} />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClasses} htmlFor={`${id}-cost`}>
          {t("cost")}
        </label>
        <Input
          id={`${id}-cost`}
          inputMode="decimal"
          min={0}
          onChange={(event) => onChange({ ...row, cost: event.target.value === "" ? null : Math.max(0, Number(event.target.value)) })}
          type="number"
          value={row.cost ?? ""}
        />
      </div>
      <Button aria-label={t("remove", { number: index + 1 })} onClick={onRemove} variant="outline">
        <Trash2 aria-hidden="true" className="size-5" />
      </Button>
    </div>
  );
}
