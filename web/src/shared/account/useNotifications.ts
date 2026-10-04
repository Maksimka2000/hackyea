"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthSession } from "@/shared/hooks/useAuthSession";

import { getNotifications, getUnreadCount, markAllNotificationsRead, markNotificationRead } from "./notificationsApi";

/** How often the bell asks for news. Plain polling: no WebSocket or push. */
export const NOTIFICATION_POLL_MS = 30_000;

export const notificationKeys = {
  unread: (userId: string) => ["notifications", userId, "unread"] as const,
  list: (userId: string) => ["notifications", userId, "list"] as const,
};

/** Unread count (polled while signed in) and, when the panel is open, the latest notices. */
export function useNotifications(isPanelOpen: boolean) {
  const session = useAuthSession();
  const queryClient = useQueryClient();
  const userId = session?.user.id ?? "anonymous";
  const isStaff = session?.user.role === "Admin";

  const unread = useQuery({
    queryKey: notificationKeys.unread(userId),
    queryFn: getUnreadCount,
    enabled: Boolean(session),
    refetchInterval: NOTIFICATION_POLL_MS,
    refetchOnWindowFocus: true,
  });

  const list = useQuery({
    queryKey: notificationKeys.list(userId),
    queryFn: () => getNotifications(isStaff),
    enabled: Boolean(session) && isPanelOpen,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
  const markRead = useMutation({ mutationFn: markNotificationRead, onSuccess: refresh });
  const markAllRead = useMutation({ mutationFn: markAllNotificationsRead, onSuccess: refresh });

  return {
    isSignedIn: Boolean(session),
    unreadCount: unread.data ?? 0,
    items: list.data ?? [],
    isLoading: list.isPending && isPanelOpen,
    markRead: (id: string) => markRead.mutate(id),
    markAllRead: () => markAllRead.mutate(),
  };
}
