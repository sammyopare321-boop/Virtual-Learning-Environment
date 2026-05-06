import EmptyState from "@/components/shared/EmptyState";

export default function AttendanceTable({ records = [] }) {
  if (!records.length) return <EmptyState title="No attendance records" message="Create attendance sessions to start recording class presence." />;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>Student</th><th>Status</th><th>Session</th></tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={record._id || index}>
              <td>{record.student?.name || record.name || "Student"}</td>
              <td>{record.status || "Unknown"}</td>
              <td>{record.session?.title || record.sessionTitle || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
