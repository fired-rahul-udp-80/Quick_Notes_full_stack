import React from 'react';
import { useSelector } from 'react-redux';
import {
  FileText,
  Bookmark,
  Eye,
  ArrowRight
} from 'lucide-react';

export const ExploreNoteCard = ({
  note,
  isEnrolled = false,
  isSaved = false,
  isOwner: propIsOwner,
  onBookmarkToggle,
  onSelectNote,
}) => {
  // Current user from auth slice
  const { user } = useSelector((state) => state.auth || {});
  const currentUserId = user?._id || user?.id;

  const noteOwnerId =
    typeof note?.owner === 'object' && note?.owner !== null
      ? note.owner._id || note.owner.id
      : note?.owner;

  // Determine if current user is the owner/creator of this note
  const isOwner =
    propIsOwner !== undefined
      ? propIsOwner
      : Boolean(currentUserId && noteOwnerId && String(currentUserId) === String(noteOwnerId));

  // Safe string extractions
  const courseName =
    typeof note?.course === 'object' && note?.course !== null
      ? note.course.name || note.course.courseCode || 'General Course'
      : note?.course || 'General Course';

  const semesterNumber =
    typeof note?.semester === 'object' && note?.semester !== null
      ? note.semester.semesterNumber || 1
      : Number(note?.semester) || 1;

  const subjectName =
    typeof note?.subject === 'object' && note?.subject !== null
      ? note.subject.name || 'Subject Curriculum'
      : note?.subject || 'Subject Curriculum';

  const ownerName = isOwner
    ? 'You (Owner)'
    : typeof note?.owner === 'object' && note?.owner !== null
    ? note.owner.name || 'Scholar'
    : note?.owner || 'Scholar';

  const fileType = (note?.fileType || 'PDF').toUpperCase();

  return (
    <div
      onClick={() => onSelectNote && onSelectNote(note)}
      className="relative bg-white border border-slate-200/90 hover:border-primary p-0 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group overflow-hidden select-none"
    >
      {/* Dog-eared PDF paper fold at top-right */}
      <div className="absolute top-0 right-0 w-7 h-7 overflow-hidden z-20 pointer-events-none">
        <div className="w-10 h-10 bg-slate-100 border-b border-l border-slate-300 shadow-xs -rotate-45 transform origin-bottom-left group-hover:bg-primary-hover group-hover:border-primary-hover transition-colors" />
      </div>

      {/* Stacked Sheet Shadow Effect (bottom edge paper stack) */}
      <div className="absolute inset-x-2 -bottom-1 h-1 bg-slate-200/80 border border-slate-300/60 -z-10 rounded-b-xs" />

      {/* ================= 1. PDF TOP HEADER BAR ================= */}
      <div className="p-4 pb-3 border-b border-slate-100 bg-linear-to-r from-slate-50 via-white to-slate-50">
        <div className="flex items-center justify-between gap-2 pr-5">
          {/* PDF Format Badge & Owner Tag */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-black tracking-wider text-white bg-primary-dark shadow-2xs">
              <FileText className="w-3 h-3 text-white" />
              <span>{fileType}</span>
            </span>

            {isOwner && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200">
                <span>My Note</span>
              </span>
            )}
          </div>
          {isEnrolled && !isOwner && (
            <span className="inline-flex uppercase items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-white bg-green-600">
                <span>Enrolled</span>
              </span>
          )}
          {/* Bookmark Button - Hidden completely for own notes */}
          {!isOwner && onBookmarkToggle && !isEnrolled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBookmarkToggle(note._id || note.id);
              }}
              title={isSaved ? 'Remove from saved' : 'Save note'}
              className={`p-1.5 transition-colors cursor-pointer border ${
                isSaved
                  ? 'border-red-200 bg-red-50 text-red-600'
                  : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* Academic Hierarchy Pills */}
        <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold truncate max-w-[150px]">
            {courseName}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600">Sem {semesterNumber}</span>
          <span className="text-slate-300">•</span>
          <span className="text-primary-dark font-semibold truncate max-w-[130px]">
            {subjectName}
          </span>
        </div>
      </div>

      {/* ================= 2. PDF PAGE PREVIEW BODY (DOCUMENT SHEET LOOK) ================= */}
      <div className="p-4 pt-3 space-y-3 flex-1 bg-white">
        {/* Document Title */}
        <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-primary-dark transition-colors line-clamp-2 leading-snug">
          {note?.title}
        </h4>

        {/* Realistic PDF Document Mock Preview Canvas */}
        <div className="relative border border-slate-200/80 bg-slate-50/60 p-3.5 space-y-2 group-hover:border-primary-hover transition-colors">
          {/* Watermark/Subject hint at top */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono border-b border-slate-200/60 pb-1">
            <span className="truncate uppercase font-bold text-slate-500">{subjectName}</span>
          </div>

          {/* Description / Summary text simulating document content */}
          {note?.description ? (
            <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed font-sans">
              {note.description}
            </p>
          ) : null}
        </div>

        {/* Tags / Keywords if any */}
        {Array.isArray(note?.tags) && note.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {note.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] text-slate-600 bg-slate-100/90 px-1.5 py-0.5 border border-slate-200/60 truncate max-w-[100px]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ================= 3. PDF FOOTER & ACTION BAR ================= */}
      <div className="px-4 py-3 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Author / Stats */}
        <div className="min-w-0 flex flex-col text-[11px]">
          <span className="text-slate-400 text-[10px]">By</span>
          <span className="font-semibold text-slate-800 truncate max-w-[120px]">
            {ownerName}
          </span>
        </div>

        {/* Read / Preview Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onSelectNote) onSelectNote(note);
          }}
          className="px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer bg-primary-dark text-white hover:bg-primary-hover shadow-2xs"
        >
          {isOwner ? (
            <>
              <FileText className="w-3.5 h-3.5" />
              <span>My Notes</span>
            </>
          ) : isEnrolled ? (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Read Notes</span>
            </>
          ) : (
            <>
              <FileText className="w-3.5 h-3.5" />
              <span>Preview Notes</span>
            </>
          )}
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default ExploreNoteCard;
