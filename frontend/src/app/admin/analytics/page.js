"use client";

import AdminLayout from "@/layouts/AdminLayout";
import AttendanceRateChart from "@/components/admin/AttendanceRateChart";
import GradeDistributionChart from "@/components/admin/GradeDistributionChart";
import UserGrowthChart from "@/components/admin/UserGrowthChart";
import { adminApi } from "@/utils/api/adminApi";
import { useFetch } from "@/hooks/useFetch";
import Loader from "@/components/shared/Loader";
import ErrorMessage from "@/components/shared/ErrorMessage";

export default function AdminAnalyticsPage() {
  const users = useFetch(() => adminApi.getUserAnalytics(), []);
  const grades = useFetch(() => adminApi.getGradeAnalytics(), []);
  const attendance = useFetch(() => adminApi.getAttendanceAnalytics(), []);
  const loading = users.loading || grades.loading || attendance.loading;
  const error = users.error || grades.error || attendance.error;

  return (
    <AdminLayout title="Analytics">
      {loading && <Loader label="Loading analytics" />}
      <ErrorMessage message={error} />
      <div className="form-grid">
        <article className="card">
          <h2>User growth</h2>
          <UserGrowthChart data={users.data || []} />
        </article>
        <article className="card">
          <h2>Grade distribution</h2>
          <GradeDistributionChart data={grades.data || {}} />
        </article>
        <article className="card">
          <h2>Attendance rates</h2>
          <AttendanceRateChart data={attendance.data || {}} />
        </article>
      </div>
    </AdminLayout>
  );
}
