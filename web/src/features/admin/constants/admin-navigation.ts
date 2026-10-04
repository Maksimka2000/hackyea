import { BarChart3, BookOpen, Inbox, LayoutDashboard, MessageSquareQuote, type LucideIcon } from "lucide-react";

type AdminNavigationItem = { key: "overview" | "inbox" | "knowledge" | "feedback" | "trends"; href: string; icon: LucideIcon };

export const adminNavigation: ReadonlyArray<AdminNavigationItem> = [
  { key: "overview", href: "/admin", icon: LayoutDashboard },
  { key: "inbox", href: "/admin/inbox", icon: Inbox },
  { key: "knowledge", href: "/admin/knowledge", icon: BookOpen },
  { key: "feedback", href: "/admin/feedback", icon: MessageSquareQuote },
  { key: "trends", href: "/admin/trends", icon: BarChart3 },
];

/** How often staff screens refresh, so a new idea shows up quickly (REST polling only). */
export const ADMIN_POLL_MS = 30_000;
