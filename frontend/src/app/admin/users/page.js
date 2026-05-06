"use client";

import AdminLayout from "@/layouts/AdminLayout";
import { adminApi } from "@/utils/api/adminApi";
import { useFetch } from "@/hooks/useFetch";
import UserTable from "@/components/admin/UserTable";
import Loader from "@/components/shared/Loader";
import ErrorMessage from "@/components/shared/ErrorMessage";
import EmptyState from "@/components/shared/EmptyState";

export default function AdminUsersPage() {
  const users = useFetch(() => adminApi.getUsers(), []);

  return (
    <AdminLayout title="User management">
      {users.loading && <Loader label="Loading users" />}
      <ErrorMessage message={users.error} />
      {users.data?.length ? (
        <UserTable users={users.data} onChanged={users.reload} />
      ) : !users.loading && (
        <EmptyState title="No users found" message="Registered users will appear here." />
      )}
    </AdminLayout>
  );
}
