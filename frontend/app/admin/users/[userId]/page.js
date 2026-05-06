"use client";

import AdminLayout from "@/layouts/AdminLayout";
import { adminApi } from "@/utils/api/adminApi";
import { useFetch } from "@/hooks/useFetch";
import Badge from "@/components/shared/Badge";
import Loader from "@/components/shared/Loader";
import ErrorMessage from "@/components/shared/ErrorMessage";
import EmptyState from "@/components/shared/EmptyState";
import { formatDate } from "@/utils/formatters";

export default function AdminUserDetailPage({ params }) {
  const user = useFetch(() => adminApi.getUser(params.userId), [params.userId]);
  const profile = user.data;

  return (
    <AdminLayout title="User profile">
      {user.loading && <Loader label="Loading user" />}
      <ErrorMessage message={user.error} />
      {profile ? (
        <div className="form-grid">
          <section className="card">
            <div className="page-header compact">
              <div>
                <h2>{profile.name}</h2>
                <p className="muted">{profile.email}</p>
              </div>
              <Badge>{profile.role}</Badge>
            </div>
            <div className="stats-grid">
              <div className="stat"><strong>{profile.status || "active"}</strong><span>Status</span></div>
              <div className="stat"><strong>{profile.department || "Not set"}</strong><span>Department</span></div>
              <div className="stat"><strong>{formatDate(profile.createdAt)}</strong><span>Joined</span></div>
              <div className="stat"><strong>{formatDate(profile.updatedAt)}</strong><span>Updated</span></div>
            </div>
          </section>
          <section className="card">
            <h2>Account details</h2>
            <table>
              <tbody>
                <tr><th>User ID</th><td>{profile._id}</td></tr>
                <tr><th>Name</th><td>{profile.name}</td></tr>
                <tr><th>Email</th><td>{profile.email}</td></tr>
                <tr><th>Role</th><td>{profile.role}</td></tr>
                <tr><th>Status</th><td>{profile.status || "active"}</td></tr>
              </tbody>
            </table>
          </section>
        </div>
      ) : !user.loading && (
        <EmptyState title="User not found" message="This user may have been removed." />
      )}
    </AdminLayout>
  );
}
