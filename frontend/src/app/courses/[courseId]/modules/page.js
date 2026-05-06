"use client";

import CourseLayout from "@/layouts/CourseLayout";
import ModuleCard from "@/components/courses/ModuleCard";
import ModuleForm from "@/components/courses/ModuleForm";
import EmptyState from "@/components/shared/EmptyState";
import Loader from "@/components/shared/Loader";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { moduleApi } from "@/utils/api/moduleApi";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@/context/AuthContext";
import { canManageCourse } from "@/utils/roleGuard";

export default function ModulesPage({ params }) {
  const { user } = useAuth();
  const modules = useFetch(() => moduleApi.getByCourse(params.courseId), [params.courseId]);

  return (
    <CourseLayout courseId={params.courseId} title="Modules">
      {modules.loading && <Loader label="Loading modules" />}
      <ErrorMessage message={modules.error} />
      {canManageCourse(user) && <div style={{ marginBottom: 18 }}><ModuleForm courseId={params.courseId} onSaved={modules.reload} /></div>}
      {modules.data?.length ? (
        <div className="card-grid">{modules.data.map((module) => <ModuleCard key={module._id} module={module} />)}</div>
      ) : !modules.loading && <EmptyState title="No modules yet" />}
    </CourseLayout>
  );
}
