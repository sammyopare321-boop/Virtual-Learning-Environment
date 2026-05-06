"use client";

import { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { adminApi } from "@/utils/api/adminApi";
import { useFetch } from "@/hooks/useFetch";
import CourseAdminTable from "@/components/admin/CourseAdminTable";
import Loader from "@/components/shared/Loader";
import ErrorMessage from "@/components/shared/ErrorMessage";
import EmptyState from "@/components/shared/EmptyState";
import Pagination from "@/components/shared/Pagination";
import { Field, Input, Select } from "@/components/shared/Input";

export default function AdminCoursesPage() {
  const [params, setParams] = useState({ page: 1, status: "", search: "" });
  const courses = useFetch(() => adminApi.getCourses(params), [params]);

  const updateFilter = (key, value) => {
    setParams((current) => ({ ...current, [key]: value, page: 1 }));
  };

  return (
    <AdminLayout title="Course management">
      <div className="form-card form-grid two" style={{ marginBottom: 18 }}>
        <Field label="Search courses">
          <Input value={params.search} onChange={(event) => updateFilter("search", event.target.value)} placeholder="Title or code" />
        </Field>
        <Field label="Status">
          <Select value={params.status} onChange={(event) => updateFilter("status", event.target.value)}>
            <option value="">All statuses</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </Select>
        </Field>
      </div>
      {courses.loading && <Loader label="Loading courses" />}
      <ErrorMessage message={courses.error} />
      {courses.data?.length ? (
        <>
          <CourseAdminTable courses={courses.data} onChanged={courses.reload} />
          <Pagination
            page={params.page}
            totalPages={courses.meta.totalPages}
            disabled={courses.loading}
            onPageChange={(page) => setParams((current) => ({ ...current, page }))}
          />
        </>
      ) : !courses.loading && (
        <EmptyState title="No courses found" message="Created courses will appear here." />
      )}
    </AdminLayout>
  );
}
