'use client';

import RouteError from '@/components/shared/RouteError';

export default function CourseSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      error={error}
      reset={reset}
      title="Course page failed to load"
      backHref="/courses"
      backLabel="Back to catalog"
    />
  );
}
