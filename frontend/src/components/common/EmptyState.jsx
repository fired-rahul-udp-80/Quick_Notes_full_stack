import React from 'react';
import { FileQuestion, FolderOpen, Bookmark, BookOpen, Plus } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = FileQuestion,
  title = 'No notes yet',
  description = 'Upload your first note and keep your study material organized.',
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white border border-dashed border-slate-200 p-8">
      <div className="w-14 h-14 rounded-2xl bg-primary-dark flex items-center justify-center text-white mb-4 shadow-xs">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6 leading-relaxed">
        {description}
      </p>

    </div>
  );
};
