import { Skeleton } from "@/shared/ui/primitives/Skeleton";

/** Mirrors the layout of MatchCard so the page does not jump when results arrive. */
export function MatchCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="border-line relative flex flex-col gap-4 overflow-hidden rounded-card border-border-strong bg-surface py-6 pr-6 pl-8 shadow-soft"
    >
      <span className="absolute inset-y-0 left-0 w-2 bg-tint-strong" />
      <div className="flex gap-3">
        <Skeleton className="h-7 w-48 rounded-full" />
        <Skeleton className="h-7 w-28 rounded-full" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-2/3" />
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="flex justify-between gap-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-5 w-32" />
      </div>
    </div>
  );
}
