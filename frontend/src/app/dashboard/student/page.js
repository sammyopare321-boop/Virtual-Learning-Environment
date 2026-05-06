"use client";

import Link from "next/link";
import DashboardLayout from "@/layouts/DashboardLayout";
import { courseApi } from "@/utils/api/courseApi";
import { gradeApi } from "@/utils/api/gradeApi";
import { useFetch } from "@/hooks/useFetch";
import CourseCard from "@/components/courses/CourseCard";
import GradeTable from "@/components/grades/GradeTable";
import Loader from "@/components/shared/Loader";
import ErrorMessage from "@/components/shared/ErrorMessage";

export default function StudentDashboardPage() {
  const courses = useFetch(() => courseApi.getMyCourses(), []);
  const grades = useFetch(() => gradeApi.getMyGrades(), []);

  return (
    <DashboardLayout title="Student dashboard" subtitle="Your courses, grades, attendance, and learning activity.">
      {(courses.loading || grades.loading) && <Loader label="Loading dashboard" />}
      <ErrorMessage message={courses.error || grades.error} />
      <section className="stats-grid" style={{ marginBottom: 18 }}>
        <div className="stat"><strong>{courses.data?.length || 0}</strong><span>Enrolled courses</span></div>
        <div className="stat"><strong>{grades.data?.length || 0}</strong><span>Grade items</span></div>
        <div className="stat"><strong><Link href="/notifications">Open</Link></strong><span>Notifications</span></div>
        <div className="stat"><strong><Link href="/messages">Open</Link></strong><span>Messages</span></div>
      </section>
      <h2>My courses</h2>
      <div className="card-grid">
        {(courses.data || []).map((course) => <CourseCard key={course._id} course={course.course || course} />)}
      </div>
      <h2 style={{ marginTop: 24 }}>Recent grades</h2>
      <GradeTable rows={grades.data || []} />
    </DashboardLayout>
  );
}
