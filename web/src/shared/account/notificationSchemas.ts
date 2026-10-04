import { z } from "zod";

export const notificationKinds = ["submissionCreated", "submitterMessage", "staffReply", "statusChanged", "feedbackReceived", "feedbackReviewed"] as const;

export const notificationDtoSchema = z.object({
  id: z.string(),
  kind: z.enum(notificationKinds),
  summary: z.string(),
  submissionId: z.string().nullable(),
  innovationId: z.string().nullable(),
  createdAt: z.string(),
  readAt: z.string().nullable(),
});

export const notificationListDtoSchema = z.array(notificationDtoSchema);
export const unreadCountDtoSchema = z.object({ count: z.number() });

export type NotificationKind = (typeof notificationKinds)[number];
export type NotificationDto = z.infer<typeof notificationDtoSchema>;

export type NotificationItem = {
  id: string;
  kind: NotificationKind;
  summary: string;
  href: string;
  createdAt: Date;
  isRead: boolean;
};
