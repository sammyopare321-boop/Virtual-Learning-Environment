import { formatDate } from "@/utils/formatters";

export default function NotificationItem({ notification, onMarkRead }) {
  return (
    <article className="card">
      <div className="page-header compact">
        <div>
          <h3>{notification.title || notification.type || "Notification"}</h3>
          {!notification.isRead && <span className="badge red">Unread</span>}
        </div>
        {!notification.isRead && (
          <button className="btn subtle" type="button" onClick={() => onMarkRead?.(notification)}>
            Mark read
          </button>
        )}
      </div>
      <p>{notification.message || notification.content}</p>
      <p className="muted">{formatDate(notification.createdAt)}</p>
    </article>
  );
}
