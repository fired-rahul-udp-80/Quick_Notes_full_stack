import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Breadcrumb } from '../../../components/common/Breadcrumb';
import { EmptyState } from '../../../components/common/EmptyState';
import { ExploreNoteCard } from '../../../components/student/exploreNotes/ExploreNoteCard';
import { academicApi } from '../../../services/academicApi';
import {
  toggleBookmarkThunk,
  selectEnrolledCourseIds,
  fetchExploreData,
} from '../../../store/slices/exploreSlice';
import { Bookmark, Loader2 } from 'lucide-react';

export const SavedNotesPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const enrolledCourseIds = useSelector(selectEnrolledCourseIds);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch saved notes on mount
  const fetchSavedNotes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await academicApi.getSavedNotes({ all: 'true' });
      if (res && res.success) {
        setSavedItems(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching saved notes:', err);
      toast.error('Failed to load saved notes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedNotes();
    // Ensure enrollments are loaded for access badges
    if (!enrolledCourseIds || enrolledCourseIds.length === 0) {
      dispatch(fetchExploreData());
    }
  }, [fetchSavedNotes, dispatch, enrolledCourseIds?.length]);

  // Remove note from bookmarks
  const handleBookmarkToggle = async (noteId) => {
    try {
      await dispatch(toggleBookmarkThunk(noteId)).unwrap();
      setSavedItems((prev) =>
        prev.filter((item) => {
          const nId = item.note?._id || item.note?.id || item._id;
          return nId !== noteId;
        })
      );
      toast.success('Note removed from bookmarks');
    } catch (err) {
      toast.error(err || 'Failed to update bookmark');
    }
  };

  // Helper to check if student is enrolled in a note's course
  const checkIsEnrolled = (note) => {
    if (!note) return false;
    const cId = typeof note.course === 'object' ? note.course?._id : note.course;
    return cId ? enrolledCourseIds.includes(cId) : false;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb */}
      <Breadcrumb items={[{ label: 'Saved Notes' }]} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Saved Notes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Your personal reading list of bookmarked academic notes across courses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {savedItems.length} Bookmarks
          </span>
          <button
            type="button"
            onClick={() => navigate('/explore')}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-colors cursor-pointer"
          >
            Explore More
          </button>
        </div>
      </div>

      {/* Saved Notes Grid or Loading / Empty State */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)] mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading saved notes...</p>
        </div>
      ) : savedItems.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved notes"
          description="Bookmark useful notes while exploring to review them later before tests and exams."
          actionLabel="Explore Academic Notes"
          onAction={() => navigate('/explore')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedItems.map((item) => {
            const note = item.note || item;
            const noteId = note._id || note.id || item._id;

            return (
              <ExploreNoteCard
                key={item._id || noteId}
                note={note}
                isEnrolled={checkIsEnrolled(note)}
                isSaved={true}
                onBookmarkToggle={handleBookmarkToggle}
                onSelectNote={(selected) =>
                  navigate('/explore/preview', { state: { note: selected } })
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedNotesPage;
