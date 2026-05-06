"use client";

import CourseLayout from "@/layouts/CourseLayout";
import AssignmentCard from "@/components/assignments/AssignmentCard";
import AssignmentForm from "@/components/assignments/AssignmentForm";
import EmptyState from "@/components/shared/EmptyState";
import Loader from "@/components/shared/Loader";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { assignmentApi } from "@/utils/api/assignmentApi";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@/context/AuthContext";
import { canManageCourse } from "@/utils/roleGuard";

export default function AssignmentsPage({ params }) {
  const { user } = useAuth();
  const assignments = useFetch(() => assignmentApi.getByCourse(params.courseId), [params.courseId]);

  return (
    <CourseLayout courseId={params.courseId} title="Assignments">
      {assignments.loading && <Loader label="Loading assignments" />}
      <ErrorMessage message={assignments.error} />
      {canManageCourse(user) && <div style={{ marginBottom: 18 }}><AssignmentForm courseId={params.courseId} onSaved={assignments.reload} /></div>}
      {assignments.data?.length ? (
        <div className="card-grid">{assignments.data.map((assignment) => <AssignmentCard key={assignment._id} assignment={assignment} courseId={params.courseId} />)}</div>
      ) : !assignments.loading && <EmptyState title="No assignments yet" />}
    </CourseLayout>
  );
}
