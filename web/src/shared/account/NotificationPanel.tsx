"use client";

import { useFormatter, useNow, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";

import type { NotificationItem } from "./notificationSchemas";

type NotificationPanelProps = Readonly<{
  id: string;
  items: NotificationItem[];
  isLoading: boolean;
  onOpenItem: (id: string) => void;
  onMarkAllRead: () => void;
}>;

export function NotificationPanel({ id, isLoading, items, onMarkAllRead, onOpenItem }: NotificationPanelProps) {
  const t = useTranslations("Account.notifications");
  const format = useFormatter();
  const now = useNow({ updateInterval: 60_000 });

  return (
    <div
      className="border-line absolute right-0 z-40 mt-2 w-80 max-w-[90vw] rounded-card border-border-strong bg-surface p-3 text-foreground shadow-card"
      id={id}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="font-bold">{t("title")}</h2>
        {items.some((item) => !item.isRead) ? (
          <button className="text-sm font-semibold text-primary underline" onClick={onMarkAllRead} type="button">
            {t("markAll")}
          </button>
        ) : null}
      </div>
      {isLoading ? <p className="text-sm text-muted">{t("loading")}</p> : null}
      {!isLoading && items.length === 0 ? <p className="text-sm text-muted">{t("empty")}</p> : null}
      <ul className="flex max-h-96 flex-col gap-1 overflow-y-auto">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              className={cn(
                "block rounded-control p-2 hover:bg-tint",
                item.isRead ? "text-muted" : "border-l-4 border-accent bg-tint font-semibold text-foreground",
              )}
              href={item.href}
              onClick={() => onOpenItem(item.id)}
            >
              <span className="block text-sm">{t(`kinds.${item.kind}`)}</span>
              <span className="block text-sm">{item.summary}</span>
              <span className="block text-xs text-muted">
                {format.relativeTime(item.createdAt, now)}
                {item.isRead ? null : <span className="sr-only"> ({t("new")})</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
