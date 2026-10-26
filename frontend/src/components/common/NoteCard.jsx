import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FileText, Bookmark, Download, Lock, Globe, Trash2 } from 'lucide-react';

export const NoteCard = ({
  note,
  onOpen,
  showActions = true,
  onDelete,
  className = ''
}) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const isPrivate = note?.visibility === 'PRIVATE';

  // Safely extract string values for fields that might be populated objects or strings
  const subjectName = typeof note?.subject === 'object' && note?.subject !== null
    ? (note.subject.name || note.subject.subjectCode || '')
    : (note?.subjectName || note?.subject || '');

  const courseName = typeof note?.course === 'object' && note?.course !== null
    ? (note.course.courseCode || note.course.name || '')
    : (note?.courseCode || note?.course || '');

  const ownerName = typeof note?.owner === 'object' && note?.owner !== null
    ? (note.owner.name || 'Student')
    : (note?.ownerName || note?.owner || 'Student');

  const lectureName = typeof note?.lecture === 'object' && note?.lecture !== null
    ? (note.lecture.title || '')
    : (note?.lecture || '');

  const handleRead = (e) => {
    e.stopPropagation();
    if (onOpen) {
      onOpen(note);
    } else {
      navigate('/note-preview', { state: { note } });
    }
  };

  return (
    <div
      onClick={handleRead}
      className={`group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:border-primary/60 dark:hover:border-primary/60 hover:shadow-md ${className}`}
    >
      <div>
        {/* Top Badges & Meta */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-light dark:bg-primary-dark/40 text-primary-dark dark:text-yellow-200 border border-primary-border/60 dark:border-primary/40">
              <FileText className="w-3 h-3 text-primary dark:text-yellow-300" />
              {note?.fileType || 'PDF'}
            </span>

            {isPrivate ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/60">
                <Lock className="w-2.5 h-2.5" />
                Private
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/60">
                <Globe className="w-2.5 h-2.5" />
                Public
              </span>
            )}

            {note?.pages && (
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                • {note.pages} pages
              </span>
            )}
          </div>
        </div>

        {/* Note Title */}
        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary dark:group-hover:text-yellow-300 transition-colors line-clamp-2 leading-snug">
          {note?.title}
        </h4>

        {/* Description */}
        {note?.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {note.description}
          </p>
        )}

        {/* Subject & Course tags */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{subjectName}</span>
            <span className="text-slate-400 dark:text-slate-500 shrink-0 font-medium">{courseName}</span>
          </div>
          {lectureName && (
            <span className="text-slate-500 dark:text-slate-400 text-[11px] truncate">
              {lectureName}
            </span>
          )}
        </div>
      </div>

      {/* Footer / Author & Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {note?.ownerAvatar ? (
            <img
              src={note.ownerAvatar}
              alt={ownerName}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
              {ownerName?.[0] || 'U'}
            </div>
          )}
          <span className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-[100px] font-medium">
            {ownerName}
          </span>
        </div>

        {showActions && (
          <div className="flex items-center gap-1">
            <button
              onClick={handleRead}
              className="px-2.5 py-1 text-xs font-semibold text-primary dark:text-yellow-300 hover:text-primary-hover dark:hover:text-yellow-200 hover:bg-primary-light dark:hover:bg-primary-dark/40 rounded-lg transition-colors cursor-pointer"
            >
              Read
            </button>
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note.id);
                }}
                title="Delete note"
                className="p-1 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
