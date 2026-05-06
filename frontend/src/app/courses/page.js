"use client";

import { useAuth } from "@/context/AuthContext";
import { courseApi } from "@/utils/api/courseApi";
import { useFetch } from "@/hooks/useFetch";
import CourseCard from "@/components/courses/CourseCard";
import CourseForm from "@/components/courses/CourseForm";
import Loader from "@/components/shared/Loader";
import ErrorMessage from "@/components/shared/ErrorMessage";
import EmptyState from "@/components/shared/EmptyState";
import { canManageCourse } from "@/utils/roleGuard";

export default function CoursesPage() {
  const { user } = useAuth();
  const courses = useFetch(() => courseApi.getAll(), []);

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">Courses</p>
          <h1>Browse courses</h1>
          <p className="muted">Find available courses and open their learning workspaces.</p>
        </div>
      </div>
      {courses.loading && <Loader label="Loading courses" />}
      <ErrorMessage message={courses.error} />
      {canManageCourse(user) && <div style={{ marginBottom: 18 }}><CourseForm onSaved={courses.reload} /></div>}
      {courses.data?.length ? (
        <div className="card-grid">{courses.data.map((course) => <CourseCard key={course._id} course={course} />)}</div>
      ) : !courses.loading && <EmptyState title="No courses found" />}
    </section>
  );
}
