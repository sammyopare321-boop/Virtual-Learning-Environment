"use client";

import { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { adminApi } from "@/utils/api/adminApi";
import { useFetch } from "@/hooks/useFetch";
import UserTable from "@/components/admin/UserTable";
import Loader from "@/components/shared/Loader";
import ErrorMessage from "@/components/shared/ErrorMessage";
import EmptyState from "@/components/shared/EmptyState";
import Pagination from "@/components/shared/Pagination";
import { Field, Input, Select } from "@/components/shared/Input";

export default function AdminUsersPage() {
  const [params, setParams] = useState({ page: 1, role: "", status: "", search: "" });
  const users = useFetch(() => adminApi.getUsers(params), [params]);

  const updateFilter = (key, value) => {
    setParams((current) => ({ ...current, [key]: value, page: 1 }));
  };

  return (
    <AdminLayout title="User management">
      <div className="form-card form-grid two" style={{ marginBottom: 18 }}>
        <Field label="Search users">
          <Input value={params.search} onChange={(event) => updateFilter("search", event.target.value)} placeholder="Name or email" />
        </Field>
        <Field label="Role">
          <Select value={params.role} onChange={(event) => updateFilter("role", event.target.value)}>
            <option value="">All roles</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
            <option value="admin">Admins</option>
          </Select>
        </Field>
        <Field label="Status">
          <Select value={params.status} onChange={(event) => updateFilter("status", event.target.value)}>
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </Select>
        </Field>
      </div>
      {users.loading && <Loader label="Loading users" />}
      <ErrorMessage message={users.error} />
      {users.data?.length ? (
        <>
          <UserTable users={users.data} onChanged={users.reload} />
          <Pagination
            page={params.page}
            totalPages={users.meta.totalPages}
            disabled={users.loading}
            onPageChange={(page) => setParams((current) => ({ ...current, page }))}
          />
        </>
      ) : !users.loading && (
        <EmptyState title="No users found" message="Registered users will appear here." />
      )}
    </AdminLayout>
  );
}
