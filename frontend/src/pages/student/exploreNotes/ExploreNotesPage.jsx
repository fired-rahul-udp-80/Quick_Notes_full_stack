import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Breadcrumb } from '../../../components/common/Breadcrumb';
import { ExploreNoteCard } from '../../../components/student/exploreNotes/ExploreNoteCard';
import {
  fetchExploreData,
  toggleBookmarkThunk,
  addEnrolledCourseId,
  resetFilters,
  selectExploreLoading,
  selectEnrolledCourseIds,
  selectEnrolledNoteIds,
  selectSavedNoteIds,
  selectFilteredExploreNotes,
} from '../../../store/slices/exploreSlice';
import { Loader2, FileText } from 'lucide-react';

export const ExploreNotesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Current logged in user from auth slice
  const { user } = useSelector((state) => state.auth || {});
  const currentUserId = user?._id || user?.id;

  // Redux Selectors
  const loading = useSelector(selectExploreLoading);
  const enrolledCourseIds = useSelector(selectEnrolledCourseIds);
  const enrolledNoteIds = useSelector(selectEnrolledNoteIds);
  const savedNoteIds = useSelector(selectSavedNoteIds);
  const filteredNotes = useSelector(selectFilteredExploreNotes);

  // Active Note Modal Preview State
  const [selectedNote, setSelectedNote] = useState(null);

  // Fetch explore catalog on mount
  useEffect(() => {
    dispatch(fetchExploreData());
  }, [dispatch]);

  // Bookmark Toggle Handler
  const handleBookmarkToggle = useCallback(
    async (noteId) => {
      try {
        const result = await dispatch(toggleBookmarkThunk(noteId)).unwrap();
        toast.success(
          result.action === 'saved' ? 'Note saved to bookmarks' : 'Note removed from bookmarks'
        );
      } catch (err) {
        toast.error(err || 'Failed to update bookmark');
      }
    },
    [dispatch]
  );

  // Course Enrollment Unlock Handler
  const handleEnrollSuccess = useCallback(
    (courseId) => {
      if (courseId) {
        dispatch(addEnrolledCourseId(courseId));
      }
    },
    [dispatch]
  );

  // Check if current user is the owner/creator of the note
  const checkIsOwner = useCallback(
    (note) => {
      if (!note || !currentUserId) return false;
      const ownerId =
        typeof note.owner === 'object' && note.owner !== null
          ? note.owner._id || note.owner.id
          : note.owner;
      return ownerId ? String(currentUserId) === String(ownerId) : false;
    },
    [currentUserId]
  );

  // Check enrollment (owner is always unlocked)
  const checkIsEnrolled = useCallback(
    (note) => {
      if (!note) return false;
      if (checkIsOwner(note)) return true;

      const nId = note._id || note.id;
      if (nId && enrolledNoteIds?.includes(nId)) return true;
      const cId = typeof note.course === 'object' ? note.course?._id : note.course;
      return cId ? enrolledCourseIds.includes(cId) : false;
    },
    [checkIsOwner, enrolledCourseIds, enrolledNoteIds]
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb */}
      <Breadcrumb items={[{ label: 'Explore Notes' }]} />

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Explore Academic Notes
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Browse curriculum notes across courses.
        </p>
      </div>

      

      {/* Notes Grid */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)] mx-auto" />
          <p className="text-xs text-slate-500">Loading academic notes catalog...</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 p-12 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No notes found</h3>
            <p className="text-xs text-slate-500">
              No study notes matched your search criteria or selected filters.
            </p>
          </div>
          <button
            type="button"
            onClick={() => dispatch(resetFilters())}
            className="px-4 py-2 text-xs font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes.map((note) => {
            const noteId = note._id || note.id;
            const isOwner = checkIsOwner(note);
            const isEnrolled = checkIsEnrolled(note);
            return (
              <ExploreNoteCard
                key={noteId}
                note={note}
                isOwner={isOwner}
                isEnrolled={isEnrolled}
                isSaved={savedNoteIds.includes(noteId)}
                onBookmarkToggle={handleBookmarkToggle}
                onSelectNote={(selected) => {
                  if (isOwner) {
                    navigate('/explore/preview', {
                      state: { note: selected, isOwner: true }
                    });
                  } else if (isEnrolled) {
                    navigate('/student/enrolled-notes', {
                      state: { note: selected, noteId }
                    });
                  } else {
                    navigate('/explore/preview', { state: { note: selected } });
                  }
                }}
              />
            );
          })}
        </div>
      )}

       
    </div>
  );
};

export default ExploreNotesPage;
