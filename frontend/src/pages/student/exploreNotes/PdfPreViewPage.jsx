import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Breadcrumb } from '../../../components/common/Breadcrumb';
import { PdfLocked } from '../../../components/common/PdfLocked';
import { noteApi } from '../../../services/noteApi';
import {
  addEnrolledCourseId,
  addEnrolledNoteId,
  toggleBookmarkThunk,
  selectEnrolledCourseIds,
  selectEnrolledNoteIds,
  selectSavedNoteIds,
  fetchExploreData,
} from '../../../store/slices/exploreSlice';
import {
  ArrowLeft,
  FileText,
  Bookmark,
  Lock,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
   
  GraduationCap,
  Loader2,
  
} from 'lucide-react';

export const PdfPreViewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const [searchParams] = useSearchParams();

  // Redux state
  const { user } = useSelector((state) => state.auth || {});
  const currentUserId = user?._id || user?.id;

  const enrolledCourseIds = useSelector(selectEnrolledCourseIds);
  const enrolledNoteIds = useSelector(selectEnrolledNoteIds);
  const savedNoteIds = useSelector(selectSavedNoteIds);

  // Note data state
  const [note, setNote] = useState(location.state?.note || null);
  const [loading, setLoading] = useState(!note);
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Viewer controls
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Resolve noteId from path params, query params, or location state
  const noteId = params.noteId || searchParams.get('id') || note?._id || note?.id;

  // 1. Ensure enrollments and explore catalog are loaded
  useEffect(() => {
    if (!enrolledCourseIds || enrolledCourseIds.length === 0) {
      dispatch(fetchExploreData());
    }
  }, [dispatch, enrolledCourseIds?.length]);

  // 2. Fetch note data by ID if not available in location state
  useEffect(() => {
    if (!note && noteId) {
      const loadNote = async () => {
        try {
          setLoading(true);
          const res = await noteApi.getNoteById(noteId);
          if (res && res.success) {
            setNote(res.data);
          } else {
            toast.error('Note not found');
          }
        } catch (err) {
          console.error('Error loading note:', err);
          toast.error('Failed to load note document');
        } finally {
          setLoading(false);
        }
      };
      loadNote();
    }
  }, [note, noteId]);

  // Extract metadata safely
  const noteTitle = note?.title || 'Curriculum PDF Note';
  const fileUrl = note?.fileUrl;

  const courseId =
    typeof note?.course === 'object' && note?.course !== null
      ? note.course._id || note.course.id
      : note?.course;

  const courseName =
    typeof note?.course === 'object' && note?.course !== null
      ? note.course.name || note.course.courseCode || 'Curriculum Course'
      : note?.course || 'Curriculum Course';

  const subjectName =
    typeof note?.subject === 'object' && note?.subject !== null
      ? note.subject.name || 'Subject'
      : note?.subject || 'Subject';

  const semesterNumber =
    typeof note?.semester === 'object' && note?.semester !== null
      ? note.semester.semesterNumber || 1
      : Number(note?.semester) || 1;

  const noteOwnerId =
    typeof note?.owner === 'object' && note?.owner !== null
      ? note.owner._id || note.owner.id
      : note?.owner;

  // Check if current user is owner of this note
  const isOwner = Boolean(
    location.state?.isOwner ||
    (currentUserId && noteOwnerId && String(currentUserId) === String(noteOwnerId))
  );

  const ownerName = isOwner
    ? 'You (Owner)'
    : typeof note?.owner === 'object' && note?.owner !== null
    ? note.owner.name || 'Student / Author'
    : note?.owner || 'Student / Author';

  // Check enrollment status (owner has unconditional access, or by note id or by course id)
  const isEnrolled = useMemo(() => {
    if (isOwner) return true;
    const currentId = note?._id || note?.id || noteId;
    if (currentId && enrolledNoteIds?.includes(currentId)) return true;
    if (courseId && enrolledCourseIds?.includes(courseId)) return true;
    return false;
  }, [isOwner, note, noteId, courseId, enrolledNoteIds, enrolledCourseIds]);

  const isSaved = useMemo(() => {
    const currentId = note?._id || note?.id;
    return currentId ? savedNoteIds.includes(currentId) : false;
  }, [note, savedNoteIds]);

  // Handle Enrollment
  const handleEnroll = async () => {
    if (isOwner) {
      toast.success('You are the author of this note. Full access granted!');
      return;
    }

    const currentId = note?._id || note?.id || noteId;
    if (!currentId) {
      toast.error('Note information missing for enrollment');
      return;
    }

    try {
      setIsEnrolling(true);
      const res = await noteApi.enrollInNote(currentId);
      if (res && res.success) {
        dispatch(addEnrolledNoteId(currentId));
        if (courseId) {
          dispatch(addEnrolledCourseId(courseId));
        }
        toast.success(`Enrolled in "${noteTitle}"! Full document unlocked.`);
        navigate('/student/enrolled-notes');
      } else {
        throw new Error(res?.message || 'Enrollment failed');
      }
    } catch (err) {
      toast.error(err.message || 'Could not enroll in note. Please try again.');
    } finally {
      setIsEnrolling(false);
    }
  };

  // Bookmark Toggle
  const handleBookmarkToggle = async () => {
    const currentId = note?._id || note?.id;
    if (!currentId) return;
    try {
      const result = await dispatch(toggleBookmarkThunk(currentId)).unwrap();
      toast.success(
        result.action === 'saved' ? 'Note saved to bookmarks' : 'Note removed from bookmarks'
      );
    } catch (err) {
      toast.error(err || 'Failed to update bookmark');
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)] mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading PDF document preview...</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4 max-w-md mx-auto my-12 shadow-xs">
        <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Note Not Found</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The requested document could not be located or has been removed.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/explore')}
          className="px-4 py-2 text-xs font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-colors cursor-pointer"
        >
          Back to Explore Notes
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Explore Notes', onClick: () => navigate('/explore') },
          { label: noteTitle },
        ]}
      />

      {/* ================= 1. PAGE HEADER & DOCUMENT BAR ================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Information */}
        <div className="flex items-start gap-3 min-w-0">
          <button
            type="button"
            onClick={() => navigate('/explore')}
            className="p-2 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title="Back to Explore Notes"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 text-[10px] font-black bg-[var(--primary)] text-white tracking-wider">
                PDF NOTE
              </span>

              {isOwner && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  MY NOTE (AUTHOR)
                </span>
              )}
            </div>

            <h1 className="text-base sm:text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight truncate max-w-xl">
              {noteTitle}
            </h1>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap font-medium">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">{courseName}</span>
              <span>•</span>
              <span>Semester {semesterNumber}</span>
              <span>•</span>
              <span className="text-red-700 dark:text-red-400 font-semibold">{subjectName}</span>
              <span>•</span>
              <span>By {ownerName}</span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          {/* Bookmark Button - Hidden for owner */}
          {!isOwner && (
            <button
              type="button"
              onClick={handleBookmarkToggle}
              className={`p-2 border transition-colors cursor-pointer inline-flex items-center gap-1 text-xs font-semibold ${
                isSaved
                  ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title={isSaved ? 'Remove Bookmark' : 'Bookmark Note'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          )}

           
          {/* Enroll Button for Unenrolled non-owner */}
          {!isEnrolled && (
            <button
              type="button"
              onClick={handleEnroll}
              disabled={isEnrolling}
              className="px-3.5 py-2 text-xs font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
            >
              {isEnrolling ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <GraduationCap className="w-3.5 h-3.5" />
              )}
              <span>Enroll to Unlock (Free)</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= 2. PDF VIEWER & 30% SCROLLABLE CONTENT ================= */}
      <div
        className={`bg-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col relative transition-all duration-300 ${
          isFullscreen ? 'fixed inset-0 z-50 h-full' : 'h-[750px] max-h-[85vh]'
        }`}
      >
        {/* Top Viewer Control Strip */}
        <div className="bg-slate-950 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-300 select-none shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium truncate max-w-xs sm:max-w-md">
              {noteTitle}
            </span>
            {isOwner && (
              <span className="px-1.5 py-0.2 text-[10px] bg-blue-900/60 text-blue-300 border border-blue-700">
                Author Full Access
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(z - 15, 60))}
              className="p-1 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 font-mono text-[11px]">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(z + 15, 175))}
              className="p-1 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="h-3 w-px bg-slate-700 mx-1" />
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Document Container */}
        <div className="flex-1 overflow-y-auto relative bg-slate-950 flex flex-col items-center p-2 sm:p-4">
          {/* ================= CASE A: USER IS ENROLLED OR OWNER (100% UNLOCKED) ================= */}
          {isEnrolled ? (
            <div
              className="w-full max-w-5xl bg-white shadow-2xl border border-slate-700 transition-all duration-200 flex-1 min-h-[650px] flex flex-col"
              style={{ width: `${zoomLevel}%` }}
            >
              {fileUrl ? (
                <iframe
                  src={`${fileUrl}#toolbar=1`}
                  title={noteTitle}
                  className="w-full flex-1 min-h-[650px] border-0"
                />
              ) : (
                <div className="py-24 text-center space-y-3">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700">PDF document file URL not available.</p>
                </div>
              )}
            </div>
          ) : (
            /* ================= CASE B: NOT ENROLLED (30% PREVIEW + SCROLL TO ENROLL) ================= */
            <div className="w-full max-w-4xl flex flex-col items-center space-y-0 relative py-4">
              {/* TOP ~30% VISIBLE PORTION OF THE NOTES */}
              <div className="w-full bg-white shadow-2xl p-6 sm:p-10 space-y-6 relative border border-slate-200 select-none">
                {/* Visible Real PDF Embed Snippet if available */}
                {fileUrl && (
                  <div className="w-full h-72 border border-slate-200 overflow-hidden relative shadow-inner">
                    <iframe
                      src={`${fileUrl}#toolbar=0&navpanes=0`}
                      title={`${noteTitle} Preview`}
                      className="w-full h-full pointer-events-none"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-2">
                      <span className="text-[11px] font-bold text-slate-500">
                        Scroll down to unlock remaining 70% content &darr;
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* PREVIEW BOUNDARY INDICATOR (After 30%) */}
              <div className="w-full my-6 flex items-center justify-center">
                <div className="w-full border-t border-dashed border-amber-400 relative flex items-center justify-center">
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 px-4 py-1 text-xs font-bold tracking-wide uppercase inline-flex items-center gap-1.5 shadow-xs">
                    <Lock className="w-3.5 h-3.5 text-amber-700" />
                    <span>30% Free Preview Limit Reached</span>
                  </span>
                </div>
              </div>

              {/* REMAINING 70% LOCKED SECTION WITH PdfLocked COMPONENT */}
              <div className="w-full relative min-h-[460px] flex items-center justify-center">
                {/* Background blurred ghost pages to simulate remaining 70% document content */}
                <div className="w-full bg-white/40 p-8 space-y-6 blur-md pointer-events-none select-none opacity-40 border border-slate-700">
                  <div className="h-4 bg-slate-400 w-3/4 rounded" />
                  <div className="h-3 bg-slate-400 w-full rounded" />
                  <div className="h-3 bg-slate-400 w-5/6 rounded" />
                  <div className="h-28 bg-slate-300 w-full rounded" />
                  <div className="h-3 bg-slate-400 w-4/5 rounded" />
                  <div className="h-3 bg-slate-400 w-full rounded" />
                  <div className="h-28 bg-slate-300 w-full rounded" />
                </div>

                {/* The common PdfLocked component layered directly on top */}
                <PdfLocked
                  courseName={courseName}
                  subjectName={subjectName}
                  noteTitle={noteTitle}
                  onEnroll={handleEnroll}
                  isEnrolling={isEnrolling}
                  className="rounded-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfPreViewPage;
