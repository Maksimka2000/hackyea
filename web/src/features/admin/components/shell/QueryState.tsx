import { useTranslations } from "next-intl";

import { Skeleton } from "@/shared/ui/primitives/Skeleton";

type QueryStateProps = Readonly<{
  isPending: boolean;
  isError: boolean;
}>;

/** Loading placeholder or load error for a staff screen; renders nothing once data is there. */
export function QueryState({ isError, isPending }: QueryStateProps) {
  const t = useTranslations("Admin");

  if (isError) {
    return (
      <p className="text-danger" role="alert">
        {t("loadError")}
      </p>
    );
  }

  return isPending ? <Skeleton className="h-40" /> : null;
}
