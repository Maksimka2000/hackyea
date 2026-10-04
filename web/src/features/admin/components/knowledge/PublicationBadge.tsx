import { useTranslations } from "next-intl";

import { cn } from "@/shared/lib/cn";

import type { PublicationStatus } from "../../schemas/adminDtoSchemas";

const classes: Record<PublicationStatus, string> = {
  draft: "border-border-strong bg-surface text-muted",
  verified: "border-primary bg-tint text-primary",
  published: "border-primary bg-primary text-primary-foreground",
};

export function PublicationBadge({ status }: Readonly<{ status: PublicationStatus }>) {
  const t = useTranslations("Admin.publication.status");

  return <span className={cn("border-line inline-flex w-fit rounded-full px-3 py-0.5 text-sm font-bold", classes[status])}>{t(status)}</span>;
}
