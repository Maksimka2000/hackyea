import { apiBaseUrl } from "@/shared/config/env";
import { fetchJson } from "@/shared/lib/fetch-json";

import { notificationListDtoSchema, unreadCountDtoSchema, type NotificationDto, type NotificationItem } from "./notificationSchemas";

/** GET /api/notifications/unread-count: polled by the bell. */
export async function getUnreadCount(): Promise<number> {
  return (await fetchJson(`${apiBaseUrl}/notifications/unread-count`, { schema: unreadCountDtoSchema })).count;
}

export async function getNotifications(isStaff: boolean): Promise<NotificationItem[]> {
  const dtos = await fetchJson(`${apiBaseUrl}/notifications`, { schema: notificationListDtoSchema });
  return dtos.map((dto) => mapNotification(dto, isStaff));
}

export async function markNotificationRead(id: string): Promise<void> {
  await fetchJson(`${apiBaseUrl}/notifications/${encodeURIComponent(id)}/read`, { method: "POST" });
}

export async function markAllNotificationsRead(): Promise<void> {
  await fetchJson(`${apiBaseUrl}/notifications/read-all`, { method: "POST" });
}

/** Staff open submissions in the panel; submitters open their own submission page. */
function mapNotification(dto: NotificationDto, isStaff: boolean): NotificationItem {
  let href = isStaff ? "/admin" : "/my-submissions";
  if (dto.submissionId) {
    href = isStaff ? `/admin/submissions/${dto.submissionId}` : `/my-submissions/${dto.submissionId}`;
  } else if (dto.kind === "feedbackReceived") {
    href = "/admin/feedback";
  } else if (dto.kind === "feedbackReviewed") {
    href = "/my-feedback";
  }

  return {
    id: dto.id,
    kind: dto.kind,
    summary: dto.summary,
    href,
    createdAt: new Date(dto.createdAt),
    isRead: dto.readAt !== null,
  };
}
