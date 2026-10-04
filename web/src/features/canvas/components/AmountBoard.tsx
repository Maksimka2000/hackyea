"use client";

import { useFormatter, useTranslations } from "next-intl";

import { Input } from "@/shared/ui/primitives/Input";

import type { CanvasBoard, PlanContent } from "../types/canvas";
import { planTotal } from "../utils/mapCanvas";

type AmountBoardProps = Readonly<{
  board: CanvasBoard;
  value: number | null;
  plan: PlanContent | undefined;
  onChange: (value: number | null) => void;
}>;

/** The requested grant, shown next to the sum of the plan so a mismatch is visible right away. */
export function AmountBoard({ board, onChange, plan, value }: AmountBoardProps) {
  const t = useTranslations("Canvas.editor");
  const format = useFormatter();
  const id = `board-${board.key}`;
  const total = planTotal(plan);

  return (
    <div className="flex flex-col gap-2">
      <label className="font-bold text-foreground" htmlFor={id}>
        {t("amountLabel")}
      </label>
      <Input
        id={id}
        inputMode="decimal"
        min={0}
        onChange={(event) => onChange(event.target.value === "" ? null : Math.max(0, Number(event.target.value)))}
        step="0.01"
        type="number"
        value={value ?? ""}
      />
      <p className="text-sm text-muted">{t("planTotal", { total: format.number(total, { style: "currency", currency: "PLN" }) })}</p>
    </div>
  );
}
