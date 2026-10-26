import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumb } from '../../../components/common/Breadcrumb';
import { CreateCourseForm } from '../../../components/student/AddNotes/CreateCourseForm';
import { AddSemesterForm } from '../../../components/student/AddNotes/AddSemesterForm';
import { AddSubjectForm } from '../../../components/student/AddNotes/AddSubjectForm';
import { UploadNoteForm } from '../../../components/student/AddNotes/UploadNoteForm';
import {
  setCurrentStep,
  resetCourseBuilder,
  setIsCompleted,
  setSelectedCourse,
  setSelectedSemester,
  setSelectedSubject,
  fetchAllCourses,
  fetchMyCourses,
  fetchSemestersByCourse,
  fetchSubjectsBySemester,
} from '../../../store/slices/courseSlice';
import {
  BookOpen,
  Calendar,
  Layers,
  UploadCloud,
  CheckCircle2,
  PlusCircle,
  Eye,
  ArrowRight,
  RotateCcw,
  Edit3,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Progressive flow: Course → Semester → Subject → Upload Note
const STEPS = [
  { id: 1, title: 'Choose Course', subtitle: 'Shared catalog or degree', icon: BookOpen },
  { id: 2, title: 'Add Semester', subtitle: 'Term & semester index', icon: Calendar },
  { id: 3, title: 'Add Subject', subtitle: 'Curriculum subjects', icon: Layers },
  { id: 4, title: 'Upload Note', subtitle: 'Attach study document', icon: UploadCloud },
];

export const AddCoursePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    selectedCourse,
    selectedSemester,
    selectedSubject,
    currentStep,
    isCompleted,
    allCourses,
    myCourses,
  } = useSelector((state) => state.course);

  // Initialize restoring as true if URL contains query params that need resolution
  const [restoring, setRestoring] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return Boolean(params.get('course') || (params.get('step') && params.get('step') !== '1'));
  });

  const lastSyncedSearchRef = useRef('');

  // 1. Initial restoration from URL query params (runs on mount)
  useEffect(() => {
    let isMounted = true;

    const restoreFromUrl = async () => {
      const params = new URLSearchParams(window.location.search);
      const cParam = params.get('course');
      const semParam = params.get('semester');
      const subParam = params.get('subject');
      const sParam = params.get('step');

      // If no query parameters, start fresh at step 1
      if (!cParam && (!sParam || sParam === '1')) {
        dispatch(resetCourseBuilder());
        dispatch(setCurrentStep(1));
        dispatch(setIsCompleted(false));
        if (isMounted) setRestoring(false);
        return;
      }

      try {
        // Step A: Load courses catalog
        let courseList = allCourses || [];
        if (courseList.length === 0) {
          const action = await dispatch(fetchAllCourses());
          courseList = action.payload || [];
        }
        if (courseList.length === 0) {
          const action = await dispatch(fetchMyCourses());
          courseList = action.payload || [];
        }

        let matchedCourse = null;
        if (cParam && courseList.length > 0) {
          const cleanCourse = decodeURIComponent(cParam).trim().toLowerCase();
          matchedCourse = courseList.find(
            (c) =>
              c &&
              (c._id === cParam ||
                (c.slug && c.slug.toLowerCase() === cleanCourse) ||
                (c.name && c.name.toLowerCase() === cleanCourse))
          );
        }

        if (!isMounted) return;

        if (matchedCourse) {
          dispatch(setSelectedCourse(matchedCourse));

          // Step B: Load semesters for the matched course
          let matchedSemester = null;
          if (semParam) {
            const semAction = await dispatch(fetchSemestersByCourse(matchedCourse._id));
            const semList = semAction.payload || [];

            if (!isMounted) return;

            const cleanSem = decodeURIComponent(semParam).trim().toLowerCase();
            matchedSemester = semList.find(
              (s) =>
                s &&
                (s._id === semParam ||
                  String(s.semesterNumber) === cleanSem ||
                  (s.name && s.name.toLowerCase() === cleanSem) ||
                  cleanSem === `semester ${s.semesterNumber}` ||
                  cleanSem === `term ${s.semesterNumber}`)
            );

            if (matchedSemester) {
              dispatch(setSelectedSemester(matchedSemester));

              // Step C: Load subjects for the matched semester
              let matchedSubject = null;
              const editSubId = params.get('editSubjectId');
              if (subParam || editSubId) {
                const subAction = await dispatch(fetchSubjectsBySemester(matchedSemester._id));
                const subList = subAction.payload || [];

                if (!isMounted) return;

                const cleanSub = subParam ? decodeURIComponent(subParam).trim().toLowerCase() : '';
                matchedSubject = subList.find(
                  (sub) =>
                    sub &&
                    (sub._id === editSubId ||
                      (cleanSub && (
                        sub._id === subParam ||
                        (sub.subjectCode && sub.subjectCode.toLowerCase() === cleanSub) ||
                        (sub.name && sub.name.toLowerCase() === cleanSub) ||
                        (sub.slug && sub.slug.toLowerCase() === cleanSub)
                      )))
                );

                if (matchedSubject) {
                  dispatch(setSelectedSubject(matchedSubject));
                }
              }

              // Determine target step based on sParam or deepest valid selection
              const targetStep = sParam
                ? Math.min(Math.max(parseInt(sParam, 10), 1), 4)
                : matchedSubject
                ? 4
                : 3;
              dispatch(setCurrentStep(targetStep));
            } else {
              // Semester not matched, land on Step 2
              const targetStep = sParam ? Math.min(Math.max(parseInt(sParam, 10), 1), 4) : 2;
              dispatch(setCurrentStep(targetStep));
            }
          } else {
            // No semester param provided, land on Step 2
            const targetStep = sParam ? Math.min(Math.max(parseInt(sParam, 10), 1), 4) : 2;
            dispatch(setCurrentStep(targetStep));
          }
        } else {
          // Course not matched, fallback to Step 1
          dispatch(setCurrentStep(1));
        }
      } catch (err) {
        console.error('Failed to restore curriculum state from URL:', err);
      } finally {
        if (isMounted) {
          setRestoring(false);
        }
      }
    };

    restoreFromUrl();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  // 2. Keep URL in sync with active step and selections once restoration is complete
  useEffect(() => {
    if (restoring) return;

    const newParams = new URLSearchParams();
    newParams.set('step', String(currentStep));

    if (selectedCourse) {
      newParams.set('course', selectedCourse.slug || selectedCourse.name);
    }

    if (selectedSemester && currentStep >= 3) {
      newParams.set('semester', String(selectedSemester.semesterNumber || selectedSemester.name));
    }

    if (selectedSubject && currentStep >= 4) {
      newParams.set('subject', selectedSubject.name);
    }

    const newQueryString = newParams.toString();
    if (newQueryString !== searchParams.toString() && newQueryString !== lastSyncedSearchRef.current) {
      lastSyncedSearchRef.current = newQueryString;
      setSearchParams(newParams, { replace: true });
    }
  }, [
    currentStep,
    selectedCourse,
    selectedSemester,
    selectedSubject,
    restoring,
    searchParams,
    setSearchParams,
  ]);

  const handleStepClick = (stepId) => {
    // Only allow navigating to steps that have valid parent data selected
    if (stepId === 1) {
      dispatch(setIsCompleted(false));
      dispatch(setCurrentStep(1));
    } else if (stepId === 2 && selectedCourse) {
      dispatch(setIsCompleted(false));
      dispatch(setCurrentStep(2));
    } else if (stepId === 3 && selectedCourse && selectedSemester) {
      dispatch(setIsCompleted(false));
      dispatch(setCurrentStep(3));
    } else if (stepId === 4 && selectedCourse && selectedSemester && selectedSubject) {
      dispatch(setIsCompleted(false));
      dispatch(setCurrentStep(4));
    }
  };

  const handleReset = () => {
    dispatch(resetCourseBuilder());
    dispatch(setCurrentStep(1));
    dispatch(setIsCompleted(false));
    setSearchParams({ step: '1' }, { replace: true });
  };

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.allSettled([
        dispatch(fetchAllCourses()),
        dispatch(fetchMyCourses()),
        selectedCourse?._id ? dispatch(fetchSemestersByCourse(selectedCourse._id)) : Promise.resolve(),
        selectedSemester?._id ? dispatch(fetchSubjectsBySemester(selectedSemester._id)) : Promise.resolve(),
      ]);
      toast.success('Curriculum catalog refreshed');
    } catch (err) {
      toast.error('Failed to refresh curriculum');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const handleAppRefresh = () => handleRefresh();
    window.addEventListener('app:refresh', handleAppRefresh);
    return () => window.removeEventListener('app:refresh', handleAppRefresh);
  }, [selectedCourse?._id, selectedSemester?._id]);

  const handleEditCurriculum = () => {
    dispatch(setIsCompleted(false));
    dispatch(setCurrentStep(3));
  };

  if (restoring) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)] mx-auto" />
        <p className="text-sm text-slate-500">Loading curriculum setup...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumb Navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-2">
        <Breadcrumb
          items={[
            { label: 'Add Academic Curriculum' },
          ]}
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[var(--primary)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
            title="Refresh courses, semesters and subjects"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[var(--primary)]' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
            title="Reset form"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Stepper Progress Bar (Circular Dashed Stepper with Global Primary Theme #8B5CF6) */}
      <div>
        <div className="w-full flex items-start justify-between">
          {STEPS.map((step, index) => {
            const isPassed = currentStep > step.id || isCompleted;
            const isActive = currentStep === step.id && !isCompleted;
            const canNavigate = isPassed || isActive;
            const isLast = index === STEPS.length - 1;

            return (
              <React.Fragment key={step.id}>
                {/* Step Circular Node & Label */}
                <div
                  onClick={() => canNavigate && handleStepClick(step.id)}
                  className={`flex flex-col items-center shrink-0 group ${
                    canNavigate ? 'cursor-pointer' : 'cursor-not-allowed'
                  }`}
                >
                  {/* Circle Node */}
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? 'border-2 border-[var(--primary)] bg-[var(--primary-light)] dark:bg-indigo-950/60 text-[var(--primary)] dark:text-indigo-400 ring-4 ring-[var(--primary)]/20'
                        : isPassed
                        ? 'border-2 border-[var(--primary)] bg-[var(--primary)] text-white shadow-xs'
                        : 'border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>

                  {/* Step Title Label */}
                  <span
                    className={`mt-2.5 sm:mt-3 text-center text-[11px] sm:text-xs md:text-sm transition-colors max-w-[85px] sm:max-w-[120px] leading-snug ${
                      isActive
                        ? 'text-[var(--primary-dark)] dark:text-indigo-400 font-bold'
                        : isPassed
                        ? 'text-slate-800 dark:text-slate-200 font-semibold'
                        : 'text-slate-400 dark:text-slate-500 font-medium'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>

                {/* Horizontal Dashed Connector Line */}
                {!isLast && (
                  <div className="flex-1 px-1 sm:px-3 mt-4.5 sm:mt-5 self-start">
                    <div
                      className={`border-t-2 border-dashed transition-colors duration-300 ${
                        currentStep > step.id || isCompleted
                          ? 'border-[var(--primary)]'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Dynamic Hierarchy Path Display */}
      {(selectedCourse || selectedSemester || selectedSubject) && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">
            Selected Hierarchy:
          </span>

          {selectedCourse && (
            <button
              onClick={() => handleStepClick(1)}
              className="hover:text-[var(--primary)] hover:underline font-semibold text-slate-800 dark:text-slate-200 cursor-pointer transition-colors shrink-0 truncate max-w-[200px]"
              title={selectedCourse.name}
            >
              {selectedCourse.name}
            </button>
          )}

          {selectedSemester && (
            <>
              <span className="text-slate-300 dark:text-slate-600 shrink-0">/</span>
              <button
                onClick={() => handleStepClick(2)}
                className="hover:text-[var(--primary)] hover:underline font-semibold text-slate-800 dark:text-slate-200 cursor-pointer transition-colors shrink-0 truncate max-w-[180px]"
                title={selectedSemester.name}
              >
                {selectedSemester.name}
              </button>
            </>
          )}

          {selectedSubject && (
            <>
              <span className="text-slate-300 dark:text-slate-600 shrink-0">/</span>
              <button
                onClick={() => handleStepClick(3)}
                className="hover:text-[var(--primary)] hover:underline font-semibold text-slate-800 dark:text-slate-200 cursor-pointer transition-colors shrink-0 truncate max-w-[180px]"
                title={selectedSubject.name}
              >
                {selectedSubject.name}
              </button>
            </>
          )}
        </div>
      )}

      {/* 3-Step Completion / Review State */}
      {isCompleted ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 p-8 shadow-xs text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              Curriculum Setup Completed!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Your Course, Semester, and Subject selections have been linked and persisted to your student workspace.
            </p>
          </div>
        </div>
      ) : (
        /* Multi-step Active Flow: 1: Course -> 2: Semester -> 3: Subject -> 4: Upload Note */
        <>
          {currentStep === 1 && <CreateCourseForm />}
          {currentStep === 2 && <AddSemesterForm />}
          {currentStep === 3 && <AddSubjectForm />}
          {currentStep === 4 && <UploadNoteForm />}
        </>
      )}
    </div>
  );
};

export default AddCoursePage;