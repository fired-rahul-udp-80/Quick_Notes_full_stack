import React from 'react';
import { Lock, GraduationCap, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';

export const PdfLocked = ({
  courseName = 'This Course',
  subjectName = 'Subject Notes',
  noteTitle = 'Academic Document',
  onEnroll,
  isEnrolling = false,
  className = '',
}) => {
  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className={`absolute inset-0 z-30 flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-slate-900/60 select-none animate-in fade-in duration-200 ${className}`}
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 sm:p-8 text-center space-y-5 relative overflow-hidden">
        {/* Subtle accent bar at top */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-linear-to-r from-amber-500 via-rose-500 to-indigo-600" />

        {/* Lock Icon */}
        <div className="mx-auto w-16 h-16 bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        {/* Header Text */}
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Document Locked</span>
          </span>

          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Enroll to Unlock Full PDF
          </h3>

          
        </div>

        {/* Key Features / Benefits */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 p-3.5 text-left text-xs space-y-2 text-slate-700 dark:text-slate-300 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Complete page access & high-res diagrams</span>
          </div>
          
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Free access to all {subjectName} materials</span>
          </div>
        </div>

        {/* Call-to-Action Action Button */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={onEnroll}
            disabled={isEnrolling}
            className="w-full py-3 px-5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            {isEnrolling ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enrolling in Course...</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-4 h-4" />
                <span>Enroll in Course to Unlock</span>
              </>
            )}
          </button>

           
        </div>
      </div>
    </div>
  );
};

export default PdfLocked;
