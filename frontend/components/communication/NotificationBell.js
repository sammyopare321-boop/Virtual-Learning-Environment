"use client";

import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationBell() {
  const { unreadCount } = useNotifications();
  return <span className="badge">{unreadCount} unread</span>;
}
