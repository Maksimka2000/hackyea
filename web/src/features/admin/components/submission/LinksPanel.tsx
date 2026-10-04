"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import type { SubmissionDetail } from "@/shared/submissions/submissionModel";
import { Button } from "@/shared/ui/primitives/Button";
import { Card } from "@/shared/ui/primitives/Card";
import { Input } from "@/shared/ui/primitives/Input";

import { getAdminInnovations } from "../../api/adminApi";
import type { ActionState } from "../../hooks/useAdminSubmission";

import { ActionError } from "./ActionError";

type LinksPanelProps = Readonly<{
  submission: SubmissionDetail;
  onReplace: (ids: string[]) => Promise<boolean>;
  state: ActionState;
}>;

const SEARCH_MIN_LENGTH = 3;

/** Staff decide which library cards are linked: remove proposed ones, search and add others. */
export function LinksPanel({ onReplace, state, submission }: LinksPanelProps) {
  const t = useTranslations("Admin.submission.links");
  const [q, setQ] = useState("");
  const current = submission.linkedInnovations;
  const ids = current.map((item) => item.id);
  const search = useQuery({
    queryKey: ["admin", "innovation-search", q],
    queryFn: () => getAdminInnovations({ q }),
    enabled: q.trim().length >= SEARCH_MIN_LENGTH,
  });

  return (
    <Card className="flex flex-col gap-3 p-5">
      <h2 className="text-lg font-bold text-foreground">{t("title")}</h2>
      {current.length === 0 ? <p className="text-sm text-muted">{t("empty")}</p> : null}
      <ul className="flex flex-col gap-2">
        {current.map((item) => (
          <li className="flex items-start justify-between gap-2" key={item.id}>
            <span className="text-sm text-foreground">{item.title}</span>
            <Button
              aria-label={t("remove", { title: item.title })}
              className="px-2 py-1"
              disabled={state.isPending}
              onClick={() => void onReplace(ids.filter((id) => id !== item.id))}
              variant="outline"
            >
              <X aria-hidden="true" className="size-4" />
            </Button>
          </li>
        ))}
      </ul>
      <label className="text-sm font-bold text-foreground" htmlFor="link-search">{t("search")}</label>
      <Input id="link-search" onChange={(event) => setQ(event.target.value)} type="search" value={q} />
      <ul aria-live="polite" className="flex flex-col gap-2">
        {(search.data ?? [])
          .filter((item) => !ids.includes(item.id))
          .slice(0, 6)
          .map((item) => (
            <li className="flex items-start justify-between gap-2" key={item.id}>
              <span className="text-sm text-foreground">{item.title}</span>
              <Button
                aria-label={t("add", { title: item.title })}
                className="px-2 py-1"
                disabled={state.isPending}
                onClick={() => void onReplace([...ids, item.id])}
                variant="outline"
              >
                <Plus aria-hidden="true" className="size-4" />
              </Button>
            </li>
          ))}
      </ul>
      <ActionError error={state.error} />
    </Card>
  );
}
