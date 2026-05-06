"use client";

import CourseLayout from "@/layouts/CourseLayout";
import QuizCard from "@/components/quizzes/QuizCard";
import QuizForm from "@/components/quizzes/QuizForm";
import EmptyState from "@/components/shared/EmptyState";
import Loader from "@/components/shared/Loader";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { quizApi } from "@/utils/api/quizApi";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@/context/AuthContext";
import { canManageCourse } from "@/utils/roleGuard";

export default function QuizzesPage({ params }) {
  const { user } = useAuth();
  const quizzes = useFetch(() => quizApi.getByCourse(params.courseId), [params.courseId]);

  return (
    <CourseLayout courseId={params.courseId} title="Quizzes">
      {quizzes.loading && <Loader label="Loading quizzes" />}
      <ErrorMessage message={quizzes.error} />
      {canManageCourse(user) && <div style={{ marginBottom: 18 }}><QuizForm courseId={params.courseId} onSaved={quizzes.reload} /></div>}
      {quizzes.data?.length ? (
        <div className="card-grid">{quizzes.data.map((quiz) => <QuizCard key={quiz._id} quiz={quiz} courseId={params.courseId} />)}</div>
      ) : !quizzes.loading && <EmptyState title="No quizzes yet" />}
    </CourseLayout>
  );
}
