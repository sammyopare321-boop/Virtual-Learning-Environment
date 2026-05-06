import { formatDate } from "@/utils/formatters";

export default function AnnouncementBanner({ announcement }) {
  return (
    <article className="card">
      <h3>{announcement.title || "Announcement"}</h3>
      <p>{announcement.message || announcement.content}</p>
      <p className="muted">{formatDate(announcement.createdAt)}</p>
    </article>
  );
}
