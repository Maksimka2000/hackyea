"use client";

import { NotificationBell } from "./NotificationBell";
import { UserMenu } from "./UserMenu";

/** Header corner: notifications and the account menu (or the sign-in link). */
export function AccountControls() {
  return (
    <div className="flex items-center gap-3">
      <NotificationBell />
      <UserMenu />
    </div>
  );
}
