"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import { courseApi } from "@/utils/api/courseApi";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@/context/AuthContext";
import CourseCard from "@/components/courses/CourseCard";
import CourseForm from "@/components/courses/CourseForm";
import Loader from "@/components/shared/Loader";
import ErrorMessage from "@/components/shared/ErrorMessage";

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const courses = useFetch(() => courseApi.getAll(), []);
  const owned = (courses.data || []).filter((course) => course.teacher?._id === user?._id || course.teacher === user?._id);

  return (
    <DashboardLayout title="Teacher dashboard" subtitle="Create courses, publish learning materials, and manage assessments.">
      {courses.loading && <Loader label="Loading courses" />}
      <ErrorMessage message={courses.error} />
      <div className="two-column">
        <CourseForm onSaved={courses.reload} />
        <section>
          <h2>My courses</h2>
          <div className="card-grid">
            {owned.map((course) => <CourseCard key={course._id} course={course} />)}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
