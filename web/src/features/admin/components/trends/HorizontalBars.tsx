import type { ReactNode } from "react";

export type BarDatum = { key: string; label: string; value: number; detail?: ReactNode };

type HorizontalBarsProps = Readonly<{
  data: BarDatum[];
  /** Accessible name of the list, e.g. "Zgłoszenia według kategorii". */
  label: string;
  valueLabel: (value: number) => string;
}>;

/**
 * One series of magnitudes as horizontal bars from a shared baseline: thin bars, rounded data end, value at the tip
 * in text ink. Hovering or focusing a row shows its breakdown. Zero rows keep their label so empty areas stay visible.
 */
export function HorizontalBars({ data, label, valueLabel }: HorizontalBarsProps) {
  const max = Math.max(1, ...data.map((datum) => datum.value));

  return (
    <ul aria-label={label} className="flex flex-col gap-3">
      {data.map((datum) => (
        <li className="group relative grid gap-1 sm:grid-cols-[minmax(10rem,16rem)_1fr] sm:items-center sm:gap-4" key={datum.key} tabIndex={datum.detail ? 0 : undefined}>
          <span className="text-sm font-semibold text-foreground">{datum.label}</span>
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="h-5 rounded-r-sm bg-primary" style={{ width: `${(datum.value / max) * 85}%` }} />
            <span className="text-sm font-bold text-foreground tabular-nums">{valueLabel(datum.value)}</span>
          </span>
          {datum.detail ? (
            <span className="border-line pointer-events-none absolute top-full right-0 z-30 mt-1 hidden rounded-control border-border-strong bg-surface p-3 text-sm text-foreground shadow-card group-hover:block group-focus:block">
              {datum.detail}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
