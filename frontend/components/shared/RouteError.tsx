'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface RouteErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  backHref?: string;
  backLabel?: string;
}

export default function RouteError({
  error,
  reset,
  title = 'Something went wrong',
  backHref = '/courses',
  backLabel = 'Back to courses',
}: RouteErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[320px] p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-6 text-rose-600">
        <AlertCircle size={28} aria-hidden />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">{title}</h2>
      <p className="text-slate-500 text-sm max-w-md mb-8 leading-relaxed">
        {error.message || 'An unexpected error occurred. You can try again or return to a safe page.'}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-primary-500 text-white font-bold text-sm hover:bg-primary-600 transition-colors"
        >
          <RefreshCw size={16} />
          Try again
        </button>
        <Link
          href={backHref}
          className="inline-flex items-center h-11 px-6 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
        >
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
