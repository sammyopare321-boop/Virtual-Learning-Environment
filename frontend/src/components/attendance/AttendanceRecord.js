import { formatShortDate } from "@/utils/formatters";

export default function AttendanceRecord({ record }) {
  return (
    <article className="card">
      <h3>{record.session?.title || "Attendance session"}</h3>
      <p>Status: <strong>{record.status || "Unknown"}</strong></p>
      <p className="muted">{formatShortDate(record.createdAt || record.date)}</p>
    </article>
  );
}
