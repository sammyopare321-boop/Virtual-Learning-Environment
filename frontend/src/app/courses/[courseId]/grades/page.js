"use client";

import CourseLayout from "@/layouts/CourseLayout";
import GradeTable from "@/components/grades/GradeTable";
import GradeChart from "@/components/grades/GradeChart";
import GradeWeightForm from "@/components/grades/GradeWeightForm";
import FinalGradeCard from "@/components/grades/FinalGradeCard";
import AtRiskTable from "@/components/grades/AtRiskTable";
import Loader from "@/components/shared/Loader";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { gradeApi } from "@/utils/api/gradeApi";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@/context/AuthContext";
import { canManageCourse } from "@/utils/roleGuard";

export default function GradesPage({ params }) {
  const { user } = useAuth();
  const teacherView = canManageCourse(user);
  const grades = useFetch(() => teacherView ? gradeApi.getGradeBook(params.courseId) : gradeApi.getMyCourseGrades(params.courseId), [params.courseId, teacherView]);
  const analytics = useFetch(() => teacherView ? gradeApi.getCourseAnalytics(params.courseId) : Promise.resolve({ data: { data: null } }), [params.courseId, teacherView]);
  const atRisk = useFetch(() => teacherView ? gradeApi.getAtRisk(params.courseId) : Promise.resolve({ data: { data: [] } }), [params.courseId, teacherView]);

  return (
    <CourseLayout courseId={params.courseId} title="Grades">
      {(grades.loading || analytics.loading) && <Loader label="Loading grades" />}
      <ErrorMessage message={grades.error || analytics.error || atRisk.error} />
      {teacherView ? (
        <div className="form-grid">
          <GradeWeightForm courseId={params.courseId} onSaved={grades.reload} />
          <div className="card"><h2>Grade analytics</h2><GradeChart data={analytics.data?.distribution || analytics.data || []} /></div>
          <GradeTable rows={Array.isArray(grades.data) ? grades.data : grades.data?.items || []} />
          <AtRiskTable students={atRisk.data || []} />
        </div>
      ) : (
        <div className="form-grid">
          <FinalGradeCard grade={grades.data?.finalGrade || grades.data} />
          <GradeTable rows={Array.isArray(grades.data) ? grades.data : grades.data?.items || []} />
        </div>
      )}
    </CourseLayout>
  );
}
