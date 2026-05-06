"use client";

import AdminLayout from "@/layouts/AdminLayout";
import AnalyticsOverview from "@/components/admin/AnalyticsOverview";
import { adminApi } from "@/utils/api/adminApi";
import { useFetch } from "@/hooks/useFetch";
import Loader from "@/components/shared/Loader";
import ErrorMessage from "@/components/shared/ErrorMessage";

export default function AdminDashboardPage() {
  const overview = useFetch(() => adminApi.getOverview(), []);
  return (
    <AdminLayout title="Admin dashboard">
      {overview.loading && <Loader label="Loading analytics" />}
      <ErrorMessage message={overview.error} />
      <AnalyticsOverview data={overview.data || {}} />
    </AdminLayout>
  );
}
