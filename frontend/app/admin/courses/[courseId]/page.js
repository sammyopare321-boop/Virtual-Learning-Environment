"use client";

import AdminLayout from "@/layouts/AdminLayout";
import ReassignTeacherModal from "@/components/admin/ReassignTeacherModal";
import { adminApi } from "@/utils/api/adminApi";
import { useFetch } from "@/hooks/useFetch";
import Badge from "@/components/shared/Badge";
import Loader from "@/components/shared/Loader";
import ErrorMessage from "@/components/shared/ErrorMessage";
import EmptyState from "@/components/shared/EmptyState";
import { formatShortDate } from "@/utils/formatters";

export default function AdminCourseDetailPage({ params }) {
  const course = useFetch(() => adminApi.getCourse(params.courseId), [params.courseId]);
  const record = course.data;

  return (
    <AdminLayout title="Course profile">
      {course.loading && <Loader label="Loading course" />}
      <ErrorMessage message={course.error} />
      {record ? (
        <div className="form-grid">
          <section className="card">
            <div className="page-header compact">
              <div>
                <h2>{record.title}</h2>
                <p className="muted">{record.code}</p>
              </div>
              <Badge>{record.status || "draft"}</Badge>
            </div>
            <p>{record.description || "No description provided."}</p>
            <div className="stats-grid">
              <div className="stat"><strong>{record.enrollmentCount || 0}</strong><span>Enrollments</span></div>
              <div className="stat"><strong>{record.teacher?.name || "Unassigned"}</strong><span>Teacher</span></div>
              <div className="stat"><strong>{record.semester || "Not set"}</strong><span>Semester</span></div>
              <div className="stat"><strong>{record.academicYear || "Not set"}</strong><span>Academic year</span></div>
            </div>
          </section>
          <div className="two-column">
            <section className="card">
              <h2>Course details</h2>
              <table>
                <tbody>
                  <tr><th>Course ID</th><td>{record._id}</td></tr>
                  <tr><th>Code</th><td>{record.code}</td></tr>
                  <tr><th>Status</th><td>{record.status || "draft"}</td></tr>
                  <tr><th>Teacher email</th><td>{record.teacher?.email || "Not set"}</td></tr>
                  <tr><th>Created</th><td>{formatShortDate(record.createdAt)}</td></tr>
                </tbody>
              </table>
            </section>
            <ReassignTeacherModal courseId={record._id} onSaved={course.reload} />
          </div>
        </div>
      ) : !course.loading && (
        <EmptyState title="Course not found" message="This course may have been removed." />
      )}
    </AdminLayout>
  );
}
