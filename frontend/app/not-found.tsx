'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4">
      <div className="text-center animate-fade-in max-w-md">
        <div className="relative inline-block mb-8">
          <p className="text-[12rem] font-display font-bold text-surface-100 leading-none select-none">404</p>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-20 h-20 bg-primary-100 rounded-3xl flex items-center justify-center text-primary-600 shadow-xl shadow-primary-100/50 rotate-12">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
             </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-display font-bold text-surface-900 mb-3 tracking-tight">Lost in the Virtual Halls?</h1>
        <p className="text-surface-500 mb-10 leading-relaxed">
          The lecture hall or resource you&apos;re looking for doesn&apos;t seem to exist. It might have been moved or archived.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary px-8">
            Return to Dashboard
          </Link>
          <button onClick={() => window.history.back()} className="btn-secondary px-8">
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
