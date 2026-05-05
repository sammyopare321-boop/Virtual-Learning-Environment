"use client";

import AdminLayout from "@/layouts/AdminLayout";
import ActivityLogTable from "@/components/admin/ActivityLogTable";
import { adminApi } from "@/utils/api/adminApi";
import { useFetch } from "@/hooks/useFetch";
import Loader from "@/components/shared/Loader";
import ErrorMessage from "@/components/shared/ErrorMessage";
import EmptyState from "@/components/shared/EmptyState";

export default function AdminLogsPage() {
  const logs = useFetch(() => adminApi.getLogs(), []);

  return (
    <AdminLayout title="Activity logs">
      {logs.loading && <Loader label="Loading logs" />}
      <ErrorMessage message={logs.error} />
      {logs.data?.length ? (
        <ActivityLogTable logs={logs.data} />
      ) : !logs.loading && (
        <EmptyState title="No activity logs" message="Administrative actions will appear here." />
      )}
    </AdminLayout>
  );
}
