"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/primitives/Button";

import type { PublicationStep } from "../../api/adminApi";
import type { PublicationStatus } from "../../schemas/adminDtoSchemas";

type PublicationActionsProps = Readonly<{
  status: PublicationStatus;
  itemTitle: string;
  isPending: boolean;
  onStep: (step: PublicationStep) => void;
  onDelete: () => void;
}>;

/** Draft → verify → publish (and back). Only an unpublished item can be deleted. */
export function PublicationActions({ isPending, itemTitle, onDelete, onStep, status }: PublicationActionsProps) {
  const t = useTranslations("Admin.publication");

  return (
    <div className="flex flex-wrap gap-2">
      {status === "draft" ? (
        <Button aria-label={t("verifyNamed", { title: itemTitle })} className="px-3 py-2" disabled={isPending} onClick={() => onStep("verify")} variant="outline">
          {t("verify")}
        </Button>
      ) : null}
      {status === "verified" ? (
        <Button aria-label={t("publishNamed", { title: itemTitle })} className="px-3 py-2" disabled={isPending} onClick={() => onStep("publish")}>
          {t("publish")}
        </Button>
      ) : null}
      {status === "published" ? (
        <Button aria-label={t("unpublishNamed", { title: itemTitle })} className="px-3 py-2" disabled={isPending} onClick={() => onStep("unpublish")} variant="outline">
          {t("unpublish")}
        </Button>
      ) : (
        <Button aria-label={t("deleteNamed", { title: itemTitle })} className="px-3 py-2" disabled={isPending} onClick={onDelete} variant="outline">
          {t("delete")}
        </Button>
      )}
    </div>
  );
}
