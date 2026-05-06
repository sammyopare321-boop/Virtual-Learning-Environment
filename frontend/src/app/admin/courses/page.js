"use client";

import AdminLayout from "@/layouts/AdminLayout";
import { adminApi } from "@/utils/api/adminApi";
import { useFetch } from "@/hooks/useFetch";
import CourseAdminTable from "@/components/admin/CourseAdminTable";
import Loader from "@/components/shared/Loader";
import ErrorMessage from "@/components/shared/ErrorMessage";
import EmptyState from "@/components/shared/EmptyState";

export default function AdminCoursesPage() {
  const courses = useFetch(() => adminApi.getCourses(), []);

  return (
    <AdminLayout title="Course management">
      {courses.loading && <Loader label="Loading courses" />}
      <ErrorMessage message={courses.error} />
      {courses.data?.length ? (
        <CourseAdminTable courses={courses.data} onChanged={courses.reload} />
      ) : !courses.loading && (
        <EmptyState title="No courses found" message="Created courses will appear here." />
      )}
    </AdminLayout>
  );
}
