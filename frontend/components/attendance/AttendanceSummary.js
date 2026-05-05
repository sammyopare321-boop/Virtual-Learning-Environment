import { percent } from "@/utils/formatters";

export default function AttendanceSummary({ summary }) {
  return (
    <section className="stats-grid">
      <div className="stat"><strong>{percent(summary?.attendanceRate ?? summary?.percentage ?? 0)}</strong><span>Attendance rate</span></div>
      <div className="stat"><strong>{summary?.presentCount ?? 0}</strong><span>Present</span></div>
      <div className="stat"><strong>{summary?.absentCount ?? 0}</strong><span>Absent</span></div>
      <div className="stat"><strong>{summary?.totalCount ?? 0}</strong><span>Total records</span></div>
    </section>
  );
}
