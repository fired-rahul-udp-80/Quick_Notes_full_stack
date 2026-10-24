import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BookOpen, ArrowRight, Loader2, Search, PlusCircle, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { academicApi } from '../../../services/academicApi';
import {
  setSelectedCourse,
  addCourse,
  setCurrentStep,
  fetchAllCourses
} from '../../../store/slices/courseSlice';

export const CreateCourseForm = () => {
  const dispatch = useDispatch();
  const { selectedCourse, allCourses, loading, error } = useSelector((state) => state.course);

  // Filter to active courses from shared catalog
  const activeCourses = (allCourses || []).filter((c) => c && c.isActive !== false);

  const [mode, setMode] = useState(() => (activeCourses.length > 0 ? 'select' : 'create'));
  const [hasAutoSwitched, setHasAutoSwitched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(selectedCourse?._id || '');

  // Form data for creating a new course
  const [formData, setFormData] = useState({
    name: '',
    courseType: 'ACADEMIC',
    isPublished: true,
  });

  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Fetch shared catalog of all courses across platform
  useEffect(() => {
    dispatch(fetchAllCourses());
  }, [dispatch]);

  // If courses load and no mode was set yet, default to 'select' if options exist
  useEffect(() => {
    if (!hasAutoSwitched && activeCourses.length > 0) {
      if (!selectedCourse) {
        setMode('select');
        setSelectedCourseId(activeCourses[0]._id);
      } else {
        setSelectedCourseId(selectedCourse._id);
      }
      setHasAutoSwitched(true);
    }
  }, [activeCourses, hasAutoSwitched, selectedCourse]);

  // Keep selectedCourseId in sync if selectedCourse changes externally
  useEffect(() => {
    if (selectedCourse?._id) {
      setSelectedCourseId(selectedCourse._id);
    }
  }, [selectedCourse]);

  const handleTextChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Filter courses by search input
  const filteredCourses = activeCourses.filter((c) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const nameMatch = c.name?.toLowerCase().includes(term);
    const typeMatch = c.courseType?.toLowerCase().includes(term);
    return nameMatch || typeMatch;
  });

  // Action 1: Select Existing Course (Reuses existing database record, NEVER calls create API)
  const handleSelectExisting = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) {
      toast.error('Please choose a course to continue');
      return;
    }

    const course = activeCourses.find((c) => c._id === selectedCourseId);
    if (!course) {
      toast.error('Selected course not found');
      return;
    }

    dispatch(setSelectedCourse(course));
    dispatch(setCurrentStep(2));
    toast.success(`Selected "${course.name}"`);
  };

  // Action 2: Create New Course (Submits only fields supported by backend schema)
  const handleCreateCourse = async (e) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      toast.error('Course name is required');
      return;
    }

    if (trimmedName.length > 150) {
      toast.error('Course name cannot exceed 150 characters');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: trimmedName,
        courseType: formData.courseType || 'ACADEMIC',
        isPublished: Boolean(formData.isPublished),
      };

      const res = await academicApi.createCourse(payload);
      if (res && res.success && res.data) {
        const returnedCourse = res.data;
        toast.success(res.message || 'Course selected successfully!');

        // Update Redux state with returned course without duplicates
        dispatch(addCourse(returnedCourse));
        dispatch(setSelectedCourse(returnedCourse));

        if (isMountedRef.current) {
          dispatch(setCurrentStep(2));
        }
      } else {
        throw new Error(res?.message || 'Failed to create course');
      }
    } catch (err) {
      toast.error(err.message || 'Could not create course. Please try again.');
    } finally {
      if (isMountedRef.current) {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header with Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-semibold bg-[var(--primary-light)] text-[var(--primary-dark)] rounded-md mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Step 1 of 3: Course Selection</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Choose or Add Course
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Select an existing degree from the shared catalog or register a new one.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="inline-flex p-1 bg-slate-200 text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMode('select')}
            className={`px-3.5 py-1.5 transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === 'select'
                ? 'bg-white text-[var(--primary)] shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Select Existing</span>
            <span className="px-1.5 py-0.2 bg-slate-200/70 text-[10px] text-slate-700">
              {activeCourses.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMode('create')}
            className={`px-3.5 py-1.5 transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === 'create'
                ? 'bg-white text-[var(--primary)] shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Add New</span>
          </button>
        </div>
      </div>

      {/* MODE 1: Select Existing Course from Shared Catalog */}
      {mode === 'select' ? (
        <form onSubmit={handleSelectExisting} className="space-y-5">
          {/* Search filter if multiple courses */}
          {activeCourses.length > 3 && (
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search existing courses by title or type..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
              />
            </div>
          )}

          {/* Loading State */}
          {loading && activeCourses.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--primary)] mx-auto" />
              <p className="text-xs text-slate-500">Loading shared course catalog...</p>
            </div>
          ) : error && activeCourses.length === 0 ? (
            /* Error & Retry State */
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>Failed to load courses</span>
              </div>
              <p>{error}</p>
              <button
                type="button"
                onClick={() => dispatch(fetchAllCourses())}
                className="inline-flex items-center gap-1 text-[var(--primary)] font-bold hover:underline cursor-pointer pt-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          ) : activeCourses.length === 0 ? (
            /* Empty State */
            <div className="py-10 text-center border-2 border-dashed border-slate-200 space-y-3">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-700">No courses in the shared catalog yet</p>
                <p className="text-xs text-slate-500">Be the first to create one for your curriculum.</p>
              </div>
              <button
                type="button"
                onClick={() => setMode('create')}
                className="px-4 py-2 text-xs font-semibold text-[var(--primary)] bg-[var(--primary-light)] hover:bg-[var(--primary-border)]/50 rounded-lg transition-colors cursor-pointer"
              >
                + Create Course
              </button>
            </div>
          ) : (
            /* Course Options Selection */
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Course from Shared Catalog ({filteredCourses.length})
              </label>

              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all cursor-pointer"
              >
                <option value="">-- Choose Course --</option>
                {filteredCourses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.courseType || 'ACADEMIC'})
                    {typeof c.semesterCount === 'number' ? ` — ${c.semesterCount} Semesters` : ''}
                  </option>
                ))}
              </select>

              <p className="text-[11px] text-slate-500">
                Selecting an existing course reuses its shared curriculum structure.
              </p>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 flex items-center justify-end border-t border-slate-100">
            <button
              type="submit"
              disabled={!selectedCourseId || loading || activeCourses.length === 0}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer inline-flex items-center gap-2 shadow-xs"
            >
              <span>Continue with this Course</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      ) : (
        /* MODE 2: Add New Course (Submits supported fields to actual backend) */
        <form onSubmit={handleCreateCourse} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Course Name */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Course Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleTextChange}
                placeholder="e.g. B.Tech Computer Science & Engineering, Master of Business Administration..."
                maxLength={150}
                required
                autoFocus
                className="w-full px-4 py-2.5 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
              />
              <p className="text-[11px] text-slate-500">
                If an existing course with this title already exists in the catalog, it will be automatically reused without creating duplicates.
              </p>
            </div>

            {/* Course Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Course Type
              </label>
              <select
                name="courseType"
                value={formData.courseType}
                onChange={handleTextChange}
                className="w-full px-4 py-2.5 border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all cursor-pointer"
              >
                <option value="ACADEMIC">Academic Degree (College / University)</option>
                <option value="SKILL">Skill / Professional Certification</option>
              </select>
            </div>

            {/* Publish Immediately */}
            <div className="flex items-center gap-3 p-3.5 border border-slate-200/80 bg-slate-50 self-end">
              <input
                type="checkbox"
                id="isPublished"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleTextChange}
                className="w-4 h-4 text-[var(--primary)] rounded focus:ring-[var(--primary)] border-slate-300 cursor-pointer"
              />
              <label htmlFor="isPublished" className="text-xs text-slate-700 select-none cursor-pointer">
                <span className="font-bold">Publish to Shared Catalog</span> — Makes course immediately accessible to peers.
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex items-center justify-end border-t border-slate-100">
            <button
              type="submit"
              disabled={submitting || !formData.name.trim()}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer inline-flex items-center gap-2 shadow-xs"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Course...</span>
                </>
              ) : (
                <>
                  <span>Create Course & Proceed</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateCourseForm;
