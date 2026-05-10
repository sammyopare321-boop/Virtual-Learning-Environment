'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, GraduationCap } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 relative overflow-hidden font-sans">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[120px]" />
      </div>

      <div className="text-center relative z-10 max-w-2xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative inline-block mb-12"
        >
          <div className="text-[14rem] font-black text-slate-100 leading-none select-none tracking-tighter">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
             <motion.div 
              initial={{ rotate: 0 }}
              animate={{ rotate: 12 }}
              className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-600/30"
             >
                <Search size={40} strokeWidth={2.5} />
             </motion.div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <GraduationCap className="text-blue-600" size={18} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Session Expired or Missing</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tighter leading-none">
            Lost in the <span className="text-blue-600">Virtual Halls?</span>
          </h1>
          <p className="text-slate-500 text-xl font-medium mb-12 leading-relaxed max-w-md mx-auto">
            The resource or classroom you&apos;re looking for doesn&apos;t seem to exist. It might have been moved or archived.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="flex items-center justify-center gap-2 h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-1 active:scale-95">
              <Home size={20} />
              Return to Workspace
            </Link>
            <button onClick={() => window.history.back()} className="flex items-center justify-center gap-2 h-14 px-10 rounded-2xl bg-white border border-slate-200 text-slate-700 font-black text-lg hover:bg-slate-50 hover:border-slate-300 transition-all hover:-translate-y-1 active:scale-95">
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
