import { formatDate } from "@/utils/formatters";

export default function ActivityLogTable({ logs = [] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>Admin</th><th>Action</th><th>Target</th><th>Date</th></tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td>{log.adminId?.name || log.admin?.name || "System"}</td>
              <td>{log.action}</td>
              <td>{log.target || log.resource || "-"}</td>
              <td>{formatDate(log.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
