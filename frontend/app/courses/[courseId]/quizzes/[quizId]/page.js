"use client";

import CourseLayout from "@/layouts/CourseLayout";
import QuestionForm from "@/components/quizzes/QuestionForm";
import QuizAttemptForm from "@/components/quizzes/QuizAttemptForm";
import Loader from "@/components/shared/Loader";
import ErrorMessage from "@/components/shared/ErrorMessage";
import EmptyState from "@/components/shared/EmptyState";
import { quizApi } from "@/utils/api/quizApi";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@/context/AuthContext";
import { canManageCourse } from "@/utils/roleGuard";

export default function QuizDetailPage({ params }) {
  const { user } = useAuth();
  const questions = useFetch(() => quizApi.getQuestions(params.courseId, params.quizId), [params.courseId, params.quizId]);
  const safeQuestions = (questions.data || []).map(({ correctAnswer, ...question }) => question);

  return (
    <CourseLayout courseId={params.courseId} title="Quiz">
      {questions.loading && <Loader label="Loading quiz" />}
      <ErrorMessage message={questions.error} />
      {canManageCourse(user) && <div style={{ marginBottom: 18 }}><QuestionForm courseId={params.courseId} quizId={params.quizId} onSaved={questions.reload} /></div>}
      {safeQuestions.length ? <QuizAttemptForm courseId={params.courseId} quizId={params.quizId} questions={safeQuestions} /> : <EmptyState title="No questions yet" />}
    </CourseLayout>
  );
}
