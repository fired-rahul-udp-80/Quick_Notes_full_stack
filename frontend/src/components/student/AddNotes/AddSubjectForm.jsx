import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Layers,
  ArrowLeft,
  ArrowRight,
  Loader2,
  PlusCircle,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  BookOpen,
  Calendar,
  Edit3
} from 'lucide-react';
import toast from 'react-hot-toast';
import { academicApi } from '../../../services/academicApi';
import {
  setSelectedSubject,
  addSubject,
  updateSubjectInList,
  setCurrentStep,
  setIsCompleted,
  fetchSubjectsBySemester
} from '../../../store/slices/courseSlice';

export const AddSubjectForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const editSubjectId = searchParams.get('editSubjectId');
  const returnTo = searchParams.get('returnTo');

  const { selectedCourse, selectedSemester, selectedSubject, subjects, loading, error } =
    useSelector((state) => state.course);

  // Active subjects under currently selected semester
  const activeSubjects = (subjects || []).filter((s) => s && s.isActive !== false);

  // Find the subject to edit if editSubjectId is present
  const editingSubject =
    (editSubjectId &&
      (activeSubjects.find((s) => s._id === editSubjectId) ||
        (selectedSubject?._id === editSubjectId ? selectedSubject : null))) ||
    null;

  const [mode, setMode] = useState(() => (editingSubject ? 'create' : activeSubjects.length > 0 ? 'select' : 'create'));
  const [hasAutoSwitched, setHasAutoSwitched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(selectedSubject?._id || '');

  // Form data for creating or editing a subject
  const [formData, setFormData] = useState({
    name: editingSubject?.name || selectedSubject?.name || '',
    subjectCode: editingSubject?.subjectCode || selectedSubject?.subjectCode || '',
  });

  const isMountedRef = useRef(true);
  const currentSemesterIdRef = useRef(selectedSemester?._id);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Sync formData and mode when editingSubject is loaded/changed
  useEffect(() => {
    if (editingSubject) {
      setMode('create');
      setFormData({
        name: editingSubject.name || '',
        subjectCode: editingSubject.subjectCode || '',
      });
    }
  }, [editingSubject?._id, editingSubject?.name, editingSubject?.subjectCode]);

  // Fetch shared catalog of subjects for the selected semester with stale-response guard
  useEffect(() => {
    currentSemesterIdRef.current = selectedSemester?._id;
    if (selectedSemester?._id) {
      dispatch(fetchSubjectsBySemester(selectedSemester._id));
    }
  }, [dispatch, selectedSemester?._id]);

  // Default mode and selection once subjects load
  useEffect(() => {
    if (!hasAutoSwitched && activeSubjects.length > 0) {
      if (!editingSubject) {
        if (!selectedSubject) {
          setMode('select');
          setSelectedSubjectId(activeSubjects[0]._id);
        } else {
          setSelectedSubjectId(selectedSubject._id);
        }
      }
      setHasAutoSwitched(true);
    }
  }, [activeSubjects, hasAutoSwitched, selectedSubject, editingSubject]);

  // Keep selectedSubjectId in sync if selectedSubject changes externally
  useEffect(() => {
    if (selectedSubject?._id) {
      setSelectedSubjectId(selectedSubject._id);
    }
  }, [selectedSubject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'subjectCode' ? value.toUpperCase() : value,
    }));
  };

  // Action 1: Select Existing Subject
  const handleSelectExisting = async (e) => {
    e.preventDefault();
    if (!selectedCourse?._id || !selectedSemester?._id) {
      toast.error('Parent course or semester missing. Please return to previous steps.');
      dispatch(setCurrentStep(2));
      return;
    }

    if (!selectedSubjectId) {
      toast.error('Please choose a subject to continue');
      return;
    }

    const sub = activeSubjects.find((s) => s._id === selectedSubjectId);
    if (!sub) {
      toast.error('Selected subject not found');
      return;
    }

    dispatch(setSelectedSubject(sub));

    // Redirect to Upload Notes form (Step 4)
    dispatch(setIsCompleted(false));
    dispatch(setCurrentStep(4));
    toast.success(`Selected "${sub.name}". Continue to upload notes!`);
  };

  // Action 2: Create New Subject or Update Existing Subject
  const handleSubmitSubject = async (e) => {
    e.preventDefault();

    if (!selectedCourse?._id || !selectedSemester?._id) {
      toast.error('Parent course or semester missing. Please return to previous steps.');
      dispatch(setCurrentStep(2));
      return;
    }

    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      toast.error('Subject name is required');
      return;
    }

    if (trimmedName.length > 150) {
      toast.error('Subject name cannot exceed 150 characters');
      return;
    }

    const trimmedCode = formData.subjectCode.trim().toUpperCase();

    // Mode A: EDIT EXISTING SUBJECT
    if (editingSubject) {
      setSubmitting(true);
      try {
        const payload = {
          name: trimmedName,
          subjectCode: trimmedCode || null,
        };

        const res = await academicApi.updateSubject(editingSubject._id, payload);
        if (res && res.success && res.data) {
          const returnedSubject = res.data;
          toast.success(res.message || 'Subject updated successfully!');

          // Update Redux state
          dispatch(updateSubjectInList(returnedSubject));
          dispatch(setSelectedSubject(returnedSubject));

          if (returnTo) {
            navigate(returnTo);
          } else {
            // Remove edit param and go to notes upload or select mode
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              next.delete('editSubjectId');
              return next;
            });
            dispatch(setIsCompleted(false));
            dispatch(setCurrentStep(4));
          }
        } else {
          throw new Error(res?.message || 'Failed to update subject');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || err.message || 'Could not update subject.');
      } finally {
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      }
      return;
    }

    // Mode B: CREATE NEW SUBJECT
    const existingSubject = activeSubjects.find(
      (s) =>
        s.name.toLowerCase() === trimmedName.toLowerCase() ||
        (trimmedCode && s.subjectCode && s.subjectCode.toUpperCase() === trimmedCode)
    );

    if (existingSubject) {
      toast(`Subject "${existingSubject.name}" already exists. Reusing existing record.`, {
        icon: 'ℹ️',
      });
      dispatch(setSelectedSubject(existingSubject));
      dispatch(setIsCompleted(false));
      dispatch(setCurrentStep(4));
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: trimmedName,
        subjectCode: trimmedCode || undefined,
      };

      const res = await academicApi.createSubject(selectedSemester._id, payload);
      if (res && res.success && res.data) {
        const returnedSubject = res.data;
        toast.success(res.message || 'Subject saved successfully!');

        // Update Redux state without duplicates
        dispatch(addSubject(returnedSubject));
        dispatch(setSelectedSubject(returnedSubject));

        if (isMountedRef.current) {
          dispatch(setIsCompleted(false));
          dispatch(setCurrentStep(4));
        }
      } else {
        throw new Error(res?.message || 'Failed to create subject');
      }
    } catch (err) {
      toast.error(err.message || 'Could not create subject. Please try again.');
    } finally {
      if (isMountedRef.current) {
        setSubmitting(false);
      }
    }
  };

  // If no parent semester is selected, block with clear recovery button
  if (!selectedSemester || !selectedCourse) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-8 text-center space-y-4 shadow-xs">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">Parent Step Incomplete</h3>
          <p className="text-xs text-slate-500">
            Please select a course and semester before adding subjects.
          </p>
        </div>
        <button
          type="button"
          onClick={() => dispatch(setCurrentStep(selectedCourse ? 2 : 1))}
          className="px-5 py-2 text-xs font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to {selectedCourse ? 'Step 2: Semester' : 'Step 1: Course'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header with Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          {editingSubject && (
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 mb-1">
              <Edit3 className="w-3 h-3" />
              <span>Editing Subject</span>
            </div>
          )}
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {editingSubject ? 'Edit Subject Name' : 'Choose or Add Subject'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {editingSubject
              ? `Updating subject details for "${editingSubject.name}" in ${selectedSemester.name}.`
              : `Pick from existing subjects in ${selectedSemester.name} or register a new subject.`}
          </p>
        </div>

        {/* Mode Switcher Tabs or Cancel Edit Button */}
        {editingSubject ? (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {returnTo ? (
              <button
                type="button"
                onClick={() => navigate(returnTo)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Cancel & Return
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSearchParams((prev) => {
                    const next = new URLSearchParams(prev);
                    next.delete('editSubjectId');
                    return next;
                  });
                  setMode('select');
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Cancel Edit
              </button>
            )}
          </div>
        ) : (
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 text-xs font-semibold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setMode('select')}
              className={`px-3.5 py-1.5 transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'select'
                  ? 'bg-white dark:bg-slate-900 text-[var(--primary)] dark:text-indigo-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <span>Select Existing</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-200/70 dark:bg-slate-700 text-[10px] text-slate-700 dark:text-slate-300">
                {activeSubjects.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMode('create')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'create'
                  ? 'bg-white dark:bg-slate-900 text-[var(--primary)] dark:text-indigo-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Add New</span>
            </button>
          </div>
        )}
      </div>

      {/* MODE 1: Select Existing Subject from Shared Catalog */}
      {mode === 'select' ? (
        <form onSubmit={handleSelectExisting} className="space-y-5">
          {/* Loading State */}
          {loading && activeSubjects.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--primary)] mx-auto" />
              <p className="text-xs text-slate-500 dark:text-slate-400">Loading subjects for {selectedSemester.name}...</p>
            </div>
          ) : error && activeSubjects.length === 0 ? (
            /* Error & Retry State */
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>Failed to load subjects</span>
              </div>
              <p>{error}</p>
              <button
                type="button"
                onClick={() => dispatch(fetchSubjectsBySemester(selectedSemester._id))}
                className="inline-flex items-center gap-1 text-[var(--primary)] font-bold hover:underline cursor-pointer pt-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          ) : activeSubjects.length === 0 ? (
            /* Empty State */
            <div className="py-10 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
              <Layers className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  No subjects added for {selectedSemester.name} yet
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Register your curriculum subjects to organize notes and study materials.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMode('create')}
                className="px-4 py-2 text-xs font-semibold text-[var(--primary)] bg-[var(--primary-light)] dark:bg-indigo-950/60 dark:text-indigo-400 hover:bg-[var(--primary-border)]/50 rounded-lg transition-colors cursor-pointer"
              >
                + Add Subject
              </button>
            </div>
          ) : (
            /* Subject Selection Grid */
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Select from Available Subjects ({activeSubjects.length})
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {activeSubjects.map((sub) => {
                  const isSelected = sub._id === selectedSubjectId;
                  const hasLectures = typeof sub.lectureCount === 'number';
                  const hasNotes = typeof sub.noteCount === 'number';

                  return (
                    <div
                      key={sub._id}
                      onClick={() => setSelectedSubjectId(sub._id)}
                      className={`p-4 border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[var(--primary)] bg-[var(--primary-light)]/30 dark:bg-indigo-950/40 ring-2 ring-[var(--primary)]/20 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-[var(--primary-dark)] dark:text-indigo-400 uppercase">
                          {sub.subjectCode || 'SUB'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {sub.noteCount === 0 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSearchParams((prev) => {
                                  const next = new URLSearchParams(prev);
                                  next.set('editSubjectId', sub._id);
                                  return next;
                                });
                              }}
                              className="p-1 rounded text-slate-400 hover:text-[var(--primary)] dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Edit Subject Name (0 notes uploaded)"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />}
                        </div>
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{sub.name}</div>

                      {/* Display counts only when supplied by the API */}
                      {(hasLectures || hasNotes) && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1.5">
                          {hasLectures && <span>{sub.lectureCount} lectures</span>}
                          {hasLectures && hasNotes && <span>•</span>}
                          {hasNotes && <span>{sub.noteCount} notes</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => dispatch(setCurrentStep(2))}
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Semester</span>
            </button>

            <button
              type="submit"
              disabled={!selectedSubjectId || loading || activeSubjects.length === 0}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer inline-flex items-center gap-2 shadow-xs"
            >
              <span>Continue to Upload Notes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      ) : (
        /* MODE 2: Add New Subject or Edit Subject (Reusing the existing create form) */
        <form onSubmit={handleSubmitSubject} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Subject Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Subject Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Data Structures & Algorithms, Digital Electronics..."
                maxLength={150}
                required
                autoFocus
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Official course curriculum title for this subject.
              </p>
            </div>

            {/* Subject Code */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Subject Code
              </label>
              <input
                type="text"
                name="subjectCode"
                value={formData.subjectCode}
                onChange={handleChange}
                placeholder="e.g. CS201, MATH101"
                maxLength={20}
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] uppercase transition-all"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Optional department code (e.g. CS201).
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            {returnTo ? (
              <button
                type="button"
                onClick={() => navigate(returnTo)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Cancel & Return</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (editingSubject) {
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);
                      next.delete('editSubjectId');
                      return next;
                    });
                    setMode('select');
                  } else {
                    dispatch(setCurrentStep(2));
                  }
                }}
                className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{editingSubject ? 'Cancel Edit' : 'Back to Semester'}</span>
              </button>
            )}

            <button
              type="submit"
              disabled={submitting || !formData.name.trim()}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer inline-flex items-center gap-2 shadow-xs"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{editingSubject ? 'Updating Subject...' : 'Saving Subject...'}</span>
                </>
              ) : editingSubject ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Update Subject</span>
                </>
              ) : (
                <>
                  <span>Save Subject & Upload Notes</span>
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

export default AddSubjectForm;
