"use client";

import { communicationApi } from "@/utils/api/communicationApi";
import { useFetch } from "@/hooks/useFetch";
import NotificationItem from "@/components/communication/NotificationItem";
import Loader from "@/components/shared/Loader";
import ErrorMessage from "@/components/shared/ErrorMessage";
import EmptyState from "@/components/shared/EmptyState";
import { unwrap } from "@/utils/formatters";

export default function NotificationsPage() {
  const notifications = useFetch(() => communicationApi.getNotifications(), []);

  const markRead = async (notification) => {
    if (notification.isRead) return;
    await communicationApi.markRead(notification._id);
    notifications.reload();
  };

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">Communication</p>
          <h1>Notifications</h1>
          <p className="muted">Course announcements, assessment updates, and account notices in one place.</p>
        </div>
      </div>
      {notifications.loading && <Loader label="Loading notifications" />}
      <ErrorMessage message={notifications.error} />
      {unwrap(notifications.data)?.length ? (
        <div className="form-grid">
          {unwrap(notifications.data).map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkRead={markRead}
            />
          ))}
        </div>
      ) : !notifications.loading && (
        <EmptyState title="No notifications" message="New course activity and account notices will appear here." />
      )}
    </section>
  );
}
