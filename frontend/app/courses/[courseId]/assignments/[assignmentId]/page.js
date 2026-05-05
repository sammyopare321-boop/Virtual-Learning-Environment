"use client";

import CourseLayout from "@/layouts/CourseLayout";
import SubmissionForm from "@/components/assignments/SubmissionForm";
import SubmissionCard from "@/components/assignments/SubmissionCard";
import Loader from "@/components/shared/Loader";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { assignmentApi } from "@/utils/api/assignmentApi";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/formatters";

export default function AssignmentDetailPage({ params }) {
  const { user } = useAuth();
  const assignment = useFetch(() => assignmentApi.getOne(params.assignmentId), [params.assignmentId]);
  const submissions = useFetch(
    () => user?.role === "student" ? assignmentApi.getMySubmission(params.assignmentId) : assignmentApi.getSubmissions(params.assignmentId),
    [params.assignmentId, user?.role]
  );

  return (
    <CourseLayout courseId={params.courseId} title={assignment.data?.title || "Assignment"}>
      {assignment.loading && <Loader label="Loading assignment" />}
      <ErrorMessage message={assignment.error || submissions.error} />
      {assignment.data && (
        <section className="card" style={{ marginBottom: 18 }}>
          <h2>{assignment.data.title}</h2>
          <p>{assignment.data.description}</p>
          <p className="muted">Due {formatDate(assignment.data.dueDate)}</p>
        </section>
      )}
      {user?.role === "student" ? (
        <SubmissionForm assignmentId={params.assignmentId} onSaved={submissions.reload} />
      ) : (
        <div className="card-grid">{(Array.isArray(submissions.data) ? submissions.data : [submissions.data].filter(Boolean)).map((item) => <SubmissionCard key={item._id} submission={item} />)}</div>
      )}
    </CourseLayout>
  );
}
