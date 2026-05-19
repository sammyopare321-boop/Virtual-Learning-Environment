'use client';

import RouteError from '@/components/shared/RouteError';

export default function DashboardError({
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
      title="Dashboard unavailable"
      backHref="/dashboard/student"
      backLabel="Go to dashboard"
    />
  );
}
