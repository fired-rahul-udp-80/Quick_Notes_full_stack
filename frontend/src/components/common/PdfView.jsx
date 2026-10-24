import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PdfLocked } from './PdfLocked';

export const PdfView = ({
  note,
  fileUrl: customFileUrl,
  title: customTitle,
  isOpen = true,
  onClose,
  isLocked = false,
  onEnroll,
  isEnrolling = false,
  userRole = 'STUDENT',
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Reset zoom on open
    setZoomLevel(100);
  }, [note, isOpen]);

  if (!isOpen) return null;

  // Safe extractions from note object or props
  const noteTitle = customTitle || note?.title || 'Academic PDF Document';
  const fileUrl = customFileUrl || note?.fileUrl;

  const courseName =
    typeof note?.course === 'object' && note?.course !== null
      ? note.course.name || note.course.courseCode || 'Course Curriculum'
      : note?.course || 'Course Curriculum';

  const subjectName =
    typeof note?.subject === 'object' && note?.subject !== null
      ? note.subject.name || 'Subject'
      : note?.subject || 'Subject';

  const semesterNumber =
    typeof note?.semester === 'object' && note?.semester !== null
      ? note.semester.semesterNumber || 1
      : Number(note?.semester) || 1;

  const ownerName =
    typeof note?.owner === 'object' && note?.owner !== null
      ? note.owner.name || 'Student / Faculty'
      : note?.owner || 'Student / Faculty';

  // Admins always have access
  const effectiveLocked = userRole === 'ADMIN' ? false : Boolean(isLocked);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 15, 175));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 15, 60));
  const handleZoomReset = () => setZoomLevel(100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`bg-slate-900 border border-slate-700/80 w-full flex flex-col shadow-2xl overflow-hidden transition-all duration-200 ${
          isFullscreen
            ? 'fixed inset-0 h-full max-w-none rounded-none'
            : 'max-w-5xl h-[92vh] rounded-none'
        }`}
      >
        {/* ================= 1. TOP DOCUMENT TOOLBAR ================= */}
        <header className="bg-slate-950 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 shrink-0 text-white select-none">
          {/* Left Metadata */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2 py-0.5 text-[10px] font-black tracking-wider bg-red-600 text-white shrink-0">
              PDF
            </span>

            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold text-slate-100 truncate max-w-[220px] sm:max-w-md">
                {noteTitle}
              </h2>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
                <span className="truncate">{courseName}</span>
                <span>•</span>
                <span>Sem {semesterNumber}</span>
                <span>•</span>
                <span className="text-slate-300 font-semibold truncate">{subjectName}</span>
              </div>
            </div>
          </div>

          {/* Middle Zoom & Screen Controls */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-900 border border-slate-800 p-1">
            <button
              type="button"
              onClick={handleZoomOut}
              title="Zoom out"
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleZoomReset}
              title="Reset Zoom"
              className="px-2 text-[11px] font-mono font-semibold text-slate-300 hover:text-white cursor-pointer"
            >
              {zoomLevel}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              title="Zoom in"
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="h-3 w-px bg-slate-700 mx-1" />
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {effectiveLocked ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <Lock className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">Locked Preview</span>
              </span>
            ) : (
              <></>
            )}

            {/* Close Button */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close Viewer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* ================= 2. PDF VIEWER CANVAS / CONTENT ================= */}
        <div className="relative flex-1 bg-slate-950 overflow-hidden flex items-center justify-center">
          {fileUrl ? (
            <div
              className="w-full h-full overflow-auto flex items-start justify-center p-2 sm:p-4 bg-slate-900/95"
              style={{
                filter: effectiveLocked ? 'blur(4px)' : 'none',
                pointerEvents: effectiveLocked ? 'none' : 'auto',
              }}
            >
              <iframe
                src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                title={noteTitle}
                className="w-full h-full bg-white shadow-2xl transition-transform duration-200"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top center',
                  minHeight: '100%',
                }}
              />
            </div>
          ) : (
            /* Fallback Document Simulator when fileUrl is not available */
            <div
              className="w-full max-w-2xl bg-white text-slate-900 p-8 shadow-2xl space-y-4 my-auto select-none"
              style={{
                filter: effectiveLocked ? 'blur(4px)' : 'none',
              }}
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-red-600 uppercase">
                    Curriculum Document Preview
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{noteTitle}</h3>
                </div>
                <span className="text-xs text-slate-400">{courseName}</span>
              </div>

              <div className="space-y-3 text-xs text-slate-700 leading-relaxed font-sans">
                <p>
                  <strong>Subject:</strong> {subjectName} (Semester {semesterNumber})
                </p>
                <p>
                  <strong>Uploaded By:</strong> {ownerName}
                </p>
                <p className="text-slate-600">
                  {note?.description ||
                    'Comprehensive lecture notes, study outlines, and verified formula derivations for semester examination preparation.'}
                </p>
                <div className="p-4 bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-800">
                  Unit 1: Theory, Core Concepts & Exam Practical Solutions
                </div>
              </div>
            </div>
          )}

          {/* ================= 3. LOCKED OVERLAY LAYER (PdfLocked) ================= */}
          {effectiveLocked && (
            <PdfLocked
              courseName={courseName}
              subjectName={subjectName}
              noteTitle={noteTitle}
              onEnroll={onEnroll}
              isEnrolling={isEnrolling}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfView;
