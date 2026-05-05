"use client";

import CourseLayout from "@/layouts/CourseLayout";
import EnrollButton from "@/components/courses/EnrollButton";
import Loader from "@/components/shared/Loader";
import ErrorMessage from "@/components/shared/ErrorMessage";
import Badge from "@/components/shared/Badge";
import { courseApi } from "@/utils/api/courseApi";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@/context/AuthContext";

export default function CourseDetailPage({ params }) {
  const { user } = useAuth();
  const course = useFetch(() => courseApi.getOne(params.courseId), [params.courseId]);
  const item = course.data;

  return (
    <CourseLayout courseId={params.courseId} title={item?.title || "Course overview"}>
      {course.loading && <Loader label="Loading course" />}
      <ErrorMessage message={course.error} />
      {item && (
        <section className="card">
          <div className="page-header">
            <div>
              <h2>{item.title}</h2>
              <p className="muted">{item.code} | {item.semester} {item.academicYear}</p>
            </div>
            <Badge>{item.status}</Badge>
          </div>
          <p>{item.description}</p>
          <p><strong>Teacher:</strong> {item.teacher?.name || "Unassigned"}</p>
          {user?.role === "student" && <EnrollButton courseId={params.courseId} />}
        </section>
      )}
    </CourseLayout>
  );
}
