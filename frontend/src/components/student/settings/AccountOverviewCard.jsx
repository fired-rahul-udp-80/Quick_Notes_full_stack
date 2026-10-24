import React from 'react';
import {
  Mail,
  ShieldCheck,
} from 'lucide-react';

export const AccountOverviewCard = ({ user }) => {
  const name = user?.name;
  const email = user?.email;
  const role = user?.role;
  const courseName = user?.academicProfile?.courseName;
  const currentSemester = user?.academicProfile?.currentSemester;
  const isVerified = user?.isVerified;

  // Generate initials for avatar
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'ST';

  return (
    <div className="relative overflow-hidden bg-white p-5 sm:p-6 select-none">


      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        {/* Left: Avatar & User Identity */}
        <div className="flex items-start sm:items-center gap-4 min-w-0">
          <div className="w-14 h-14 bg-gradient-to-br from-[var(--primary)] to-slate-900 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-sm border border-slate-200">
            {initials}
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight truncate max-w-sm">
                {name}
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-[var(--primary-light)] text-[var(--primary-dark)]">
                {role}
              </span>
              {isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Verified</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium truncate">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{email}</span>
            </div>
          </div>
        </div>

        {/* Right: Academic Status Badges */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-6 shrink-0">
          <div className="bg-slate-50 border border-slate-200/80 p-2.5 px-3.5 min-w-[120px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Enrolled Course
            </span>
            <span className="text-xs font-black text-slate-800 truncate block mt-0.5">
              {courseName}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 p-2.5 px-3.5 min-w-[100px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Academic Stage
            </span>
            <span className="text-xs font-black text-[var(--primary-dark)] truncate block mt-0.5">
              Semester {currentSemester}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOverviewCard;
