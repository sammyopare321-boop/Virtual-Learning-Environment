"use client";

import CourseLayout from "@/layouts/CourseLayout";
import LiveSessionCard from "@/components/live/LiveSessionCard";
import LiveSessionForm from "@/components/live/LiveSessionForm";
import EmptyState from "@/components/shared/EmptyState";
import Loader from "@/components/shared/Loader";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { liveApi } from "@/utils/api/liveApi";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@/context/AuthContext";
import { canManageCourse } from "@/utils/roleGuard";

export default function LivePage({ params }) {
  const { user } = useAuth();
  const sessions = useFetch(() => liveApi.getByCourse(params.courseId), [params.courseId]);

  return (
    <CourseLayout courseId={params.courseId} title="Live classroom">
      {sessions.loading && <Loader label="Loading live sessions" />}
      <ErrorMessage message={sessions.error} />
      {canManageCourse(user) && <div style={{ marginBottom: 18 }}><LiveSessionForm courseId={params.courseId} onSaved={sessions.reload} /></div>}
      {sessions.data?.length ? <div className="card-grid">{sessions.data.map((session) => <LiveSessionCard key={session._id} session={session} courseId={params.courseId} />)}</div> : !sessions.loading && <EmptyState title="No live sessions scheduled" />}
    </CourseLayout>
  );
}
