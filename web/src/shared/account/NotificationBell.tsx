"use client";

import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";

import { useDisclosure } from "@/shared/hooks/useDisclosure";

import { NotificationPanel } from "./NotificationPanel";
import { useNotifications } from "./useNotifications";

const PANEL_ID = "notification-panel";

/** Bell with the unread count, polled in the background; opens the latest notices. */
export function NotificationBell() {
  const t = useTranslations("Account.notifications");
  const { close, isOpen, toggle } = useDisclosure();
  const { isLoading, isSignedIn, items, markAllRead, markRead, unreadCount } = useNotifications(isOpen);

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="relative">
      <button
        aria-controls={PANEL_ID}
        aria-expanded={isOpen}
        aria-label={t("button", { count: unreadCount })}
        className="border-line relative inline-flex items-center rounded-control border-hero-foreground/60 p-2 text-hero-foreground"
        onClick={toggle}
        type="button"
      >
        <Bell aria-hidden="true" className="size-5" />
        {unreadCount > 0 ? (
          <span
            aria-hidden="true"
            className="absolute -top-2 -right-2 grid min-w-6 place-items-center rounded-full bg-accent px-1 text-xs font-extrabold text-accent-foreground"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </button>
      {/* Announces new notices to screen readers when the polled count changes. */}
      <span aria-live="polite" className="sr-only" role="status">
        {unreadCount > 0 ? t("unread", { count: unreadCount }) : ""}
      </span>
      {isOpen ? (
        <NotificationPanel
          id={PANEL_ID}
          isLoading={isLoading}
          items={items}
          onMarkAllRead={markAllRead}
          onOpenItem={(id) => {
            markRead(id);
            close();
          }}
        />
      ) : null}
    </div>
  );
}
