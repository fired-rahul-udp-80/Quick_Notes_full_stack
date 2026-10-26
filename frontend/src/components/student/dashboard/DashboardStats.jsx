import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, BookOpen, Bookmark, Eye } from 'lucide-react';

export const DashboardStats = ({ stats = {}, loading = false }) => {
  const navigate = useNavigate();

  const cards = [
    {
      id: 'my-notes',
      label: 'My Notes',
      value: stats.myNotesCount ?? 0,
      subtext: 'Uploaded in library',
      icon: FileText,
      colorClass: 'bg-primary-light text-primary-dark dark:bg-primary-dark/40 dark:text-yellow-200 group-hover:bg-primary group-hover:text-white',
      hoverBorder: 'hover:border-primary/60 dark:hover:border-primary/60',
      onClick: () => navigate('/student/my-notes'),
    },
    {
      id: 'enrolled-notes',
      label: 'Enrolled Notes',
      value: stats.enrolledCoursesCount ?? 0,
      subtext: 'Active study tracks',
      icon: BookOpen,
      colorClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white',
      hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-600/60',
      onClick: () => navigate('/student/enrolled-notes'),
    },
    {
      id: 'saved-notes',
      label: 'Saved Notes',
      value: stats.savedNotesCount ?? 0,
      subtext: 'Bookmarked for revision',
      icon: Bookmark,
      colorClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white',
      hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-600/60',
      onClick: () => navigate('/student/saved-notes'),
    },
    {
      id: 'notes-read',
      label: 'Notes Read',
      value: stats.notesReadCount ?? 0,
      subtext: 'Study sessions logged',
      icon: Eye,
      colorClass: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
      hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-600/60',
      onClick: null,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={card.onClick || undefined}
            className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 transition-all flex flex-col justify-between ${
              card.onClick ? 'cursor-pointer group ' + card.hoverBorder : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {card.label}
              </span>
              <div
                className={`w-8 h-8 flex items-center justify-center transition-colors rounded-lg ${card.colorClass}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {loading ? (
              <div className="mt-3 space-y-2">
                <div className="h-8 bg-slate-100 dark:bg-slate-800 animate-pulse w-16 rounded"></div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 animate-pulse w-28 rounded"></div>
              </div>
            ) : (
              <div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
                  {card.value}
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {card.subtext}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
