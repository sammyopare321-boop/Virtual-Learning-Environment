"use client";

import { adminApi } from "@/utils/api/adminApi";
import Badge from "@/components/shared/Badge";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

export default function UserTable({ users = [], onChanged }) {
  const changeRole = async (id, role) => {
    await adminApi.changeRole(id, role);
    onChanged?.();
  };

  const changeStatus = async (id, status) => {
    await adminApi.changeStatus(id, status);
    onChanged?.();
  };

  const impersonate = async (id) => {
    const response = await adminApi.impersonate(id);
    const token = response.data?.impersonationToken || response.data?.token;
    if (token) document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    window.location.href = "/dashboard/student";
  };

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td><Badge>{user.role}</Badge></td>
              <td>{user.status || "active"}</td>
              <td>
                <div className="button-row">
                  <select className="select" value={user.role} onChange={(e) => changeRole(user._id, e.target.value)} aria-label="Change role">
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button className="btn subtle" type="button" onClick={() => changeStatus(user._id, user.status === "suspended" ? "active" : "suspended")}>
                    {user.status === "suspended" ? "Activate" : "Suspend"}
                  </button>
                  <button className="btn secondary" type="button" onClick={() => impersonate(user._id)}>Impersonate</button>
                  <ConfirmDialog message={`Delete ${user.name}?`} confirmLabel="Delete" onConfirm={async () => { await adminApi.deleteUser(user._id); onChanged?.(); }} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
