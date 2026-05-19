import { Loader2 } from 'lucide-react';

interface RouteLoadingProps {
  label?: string;
}

export default function RouteLoading({ label = 'Loading…' }: RouteLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[320px] gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-primary-500" aria-hidden />
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}
