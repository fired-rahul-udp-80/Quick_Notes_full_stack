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
      colorClass: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
      hoverBorder: 'hover:border-indigo-300',
      onClick: () => navigate('/student/my-notes'),
    },
    {
      id: 'enrolled-notes',
      label: 'Enrolled Notes',
      value: stats.enrolledCoursesCount ?? 0,
      subtext: 'Active study tracks',
      icon: BookOpen,
      colorClass: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
      hoverBorder: 'hover:border-blue-300',
      onClick: () => navigate('/student/enrolled-notes'),
    },
    {
      id: 'saved-notes',
      label: 'Saved Notes',
      value: stats.savedNotesCount ?? 0,
      subtext: 'Bookmarked for revision',
      icon: Bookmark,
      colorClass: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
      hoverBorder: 'hover:border-emerald-300',
      onClick: () => navigate('/student/saved-notes'),
    },
    {
      id: 'notes-read',
      label: 'Notes Read',
      value: stats.notesReadCount ?? 0,
      subtext: 'Study sessions logged',
      icon: Eye,
      colorClass: 'bg-amber-50 text-amber-600',
      hoverBorder: 'hover:border-amber-300',
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
            className={`bg-white border border-slate-200 p-5 transition-all flex flex-col justify-between ${
              card.onClick ? 'cursor-pointer group ' + card.hoverBorder : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {card.label}
              </span>
              <div
                className={`w-8 h-8 flex items-center justify-center transition-colors ${card.colorClass}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {loading ? (
              <div className="mt-3 space-y-2">
                <div className="h-8 bg-slate-100 animate-pulse w-16"></div>
                <div className="h-3 bg-slate-100 animate-pulse w-28"></div>
              </div>
            ) : (
              <div>
                <div className="text-3xl font-extrabold text-slate-900 mt-3">
                  {card.value}
                </div>
                <div className="text-xs text-slate-400 mt-1">
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
