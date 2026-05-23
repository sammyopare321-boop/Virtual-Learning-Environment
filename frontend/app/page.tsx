'use client';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
      {/* Simple decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 w-[600px] h-[600px] -translate-x-1/2 bg-blue-200/30 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <GraduationCap size={48} className="text-blue-600" />
          <h1 className="text-4xl font-bold text-slate-900">UniLearn</h1>
        </div>
        <p className="max-w-md text-lg text-slate-700">
          A clean, lightweight learning workspace for students, teachers and administrators.
        </p>
        <Link
          href="/auth/register"
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
        >
          Get Started Free
        </Link>
        <Link href="/auth/login" className="text-sm text-slate-600 underline mt-2">
          Already have an account? Sign In
        </Link>
      </div>
    </div>
  );
}
