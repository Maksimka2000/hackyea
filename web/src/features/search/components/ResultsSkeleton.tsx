import { MatchCardSkeleton } from "./MatchCardSkeleton";

const SKELETON_COUNT = 3;

export function ResultsSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-6">
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <MatchCardSkeleton key={index} />
      ))}
    </div>
  );
}
