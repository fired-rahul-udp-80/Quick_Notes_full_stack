import React, { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumb } from '../../../components/common/Breadcrumb';
import {
  fetchMyCourses,
  fetchSemestersByCourse,
  fetchSubjectsForSemesters,
  setSelectedCourse
} from '../../../store/slices/courseSlice';
import {
  Calendar,
  Plus,
  Loader2,
  FileText
} from 'lucide-react';

export const MyStudyPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const courseQuery = searchParams.get('course');

  // Pure Redux state from courseSlice for maximum performance & caching
  const {
    myCourses,
    selectedCourse,
    semesters,
    subjectsBySemester,
    loading
  } = useSelector((state) => state.course);

  // 1. Fetch logged-in student's courses via courseSlice thunk if not already cached
  useEffect(() => {
    if (!myCourses || myCourses.length === 0) {
      dispatch(fetchMyCourses());
    }
  }, [dispatch, myCourses?.length]);

  // 2. Select initial active course based on URL (?course=btech / ?course=bca), localStorage, or default
  useEffect(() => {
    if (myCourses.length > 0) {
      let targetCourse = null;

      // Priority 1: Match from URL parameter (?course=btech / ?course=bca / ?course=B.Tech)
      if (courseQuery) {
        const cleanQuery = decodeURIComponent(courseQuery).trim().toLowerCase();
        targetCourse = myCourses.find(
          (c) =>
            c.slug?.toLowerCase() === cleanQuery ||
            c.name?.toLowerCase() === cleanQuery ||
            c.courseCode?.toLowerCase() === cleanQuery ||
            c._id === courseQuery
        );
      }

      // Priority 2: Match from localStorage
      if (!targetCourse) {
        const savedId = localStorage.getItem('my_study_selected_course');
        if (savedId) {
          targetCourse = myCourses.find((c) => c._id === savedId);
        }
      }

      // Priority 3: Current selectedCourse in Redux or fallback to first course
      if (!targetCourse) {
        targetCourse =
          selectedCourse && myCourses.some((c) => c._id === selectedCourse._id)
            ? selectedCourse
            : myCourses[0];
      }

      // Update Redux state if different
      if (!selectedCourse || selectedCourse._id !== targetCourse._id) {
        dispatch(setSelectedCourse(targetCourse));
      }

      // Persist to localStorage
      localStorage.setItem('my_study_selected_course', targetCourse._id);

      // Sync URL query param (?course=btech or ?course=bca)
      const currentParam = targetCourse.slug || targetCourse.name;
      if (courseQuery !== currentParam) {
        setSearchParams({ course: currentParam }, { replace: true });
      }
    }
  }, [myCourses, courseQuery, selectedCourse, dispatch, setSearchParams]);

  // 3. When selected course is active, fetch its semesters via courseSlice thunk
  useEffect(() => {
    if (selectedCourse?._id) {
      dispatch(fetchSemestersByCourse(selectedCourse._id));
    }
  }, [selectedCourse?._id, dispatch]);

  // 4. Batch-fetch subjects for all active semesters with Redux caching
  useEffect(() => {
    if (semesters.length > 0) {
      const semesterIds = semesters.map((s) => s._id);
      dispatch(fetchSubjectsForSemesters(semesterIds));
    }
  }, [semesters, dispatch]);

  // Only show semesters where the logged-in student has uploaded notes (strictly noteCount > 0)
  const mySemesters = useMemo(() => {
    return (semesters || []).filter((sem) => (sem.noteCount || sem.myNoteCount || 0) > 0);
  }, [semesters]);

  // Course switcher handler: updates Redux, localStorage, and URL query param
  const handleCourseChange = (courseId) => {
    const course = myCourses.find((c) => c._id === courseId);
    if (course) {
      dispatch(setSelectedCourse(course));
      localStorage.setItem('my_study_selected_course', course._id);
      const courseParam = course.slug || course.name;
      setSearchParams({ course: courseParam });
    }
  };

  if (loading && myCourses.length === 0) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)] mx-auto" />
        <p className="text-sm text-slate-500">Loading your study curriculum...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-200">
      {/* Top Breadcrumb */}
      <Breadcrumb items={[{ label: 'My Study' }]} />

      {/* Course Switcher */}
      {myCourses.length > 0 && (
        <div className="flex items-center gap-2 bg-slate-50 p-2.5">
          <span className="text-xs font-bold text-slate-500 uppercase px-2">Course:</span>
          {myCourses.length > 1 ? (
            <select
              value={selectedCourse?._id || ''}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
            >
              {myCourses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
              {selectedCourse?.name || myCourses[0]?.name}
            </span>
          )}
        </div>
      )}

      {/* ================= SEMESTERS GRID ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Available Semesters ({mySemesters.length})
          </h2>
          <span className="text-xs text-slate-400">Click a semester to open notes</span>
        </div>

        {myCourses.length === 0 ? (
          <div className="p-10 text-center bg-white border border-dashed border-slate-200 space-y-3">
            <Calendar className="w-9 h-9 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800">No courses created yet</h3>
              <p className="text-xs text-slate-500">
                You haven't created any course yet. Create a course to add semesters and study notes.
              </p>
            </div>
            <button
              onClick={() => navigate('/student/add-notes?step=1')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Create Course</span>
            </button>
          </div>
        ) : mySemesters.length === 0 ? (
          <div className="p-10 text-center bg-white border border-dashed border-slate-200 space-y-3">
            <Calendar className="w-9 h-9 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800">No notes available in {selectedCourse?.name || 'this course'}</h3>
              <p className="text-xs text-slate-500">
                You haven't uploaded any notes in this course yet. Upload notes to see your semesters here.
              </p>
            </div>
            <button
              onClick={() => {
                const courseParam = selectedCourse?.slug || selectedCourse?.name || '';
                navigate(courseParam ? `/student/add-notes?step=2&course=${encodeURIComponent(courseParam)}` : '/student/add-notes?step=1');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Upload Note</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mySemesters.map((sem) => {
              const semNumber = sem.semesterNumber || 1;
              // Only include subjects where student has uploaded notes (strictly noteCount > 0)
              const semSubjects = (subjectsBySemester[sem._id] || []).filter(
                (sub) => (sub.noteCount || 0) > 0
              );

              return (
                <div
                  key={sem._id}
                  className="bg-white border border-slate-200 hover:border-[var(--primary)] p-5 hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-3">
                    {/* Top Term Tag */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[var(--primary-light)] text-[var(--primary-dark)]">
                        Term {semNumber}
                      </span>
                      <Calendar className="w-4 h-4 text-slate-400 group-hover:text-[var(--primary)] transition-colors" />
                    </div>

                    <div className="flex justify-between items-start gap-2">
                      <div>
                        {/* Semester Name */}
                        <h3
                          onClick={() => navigate(`/student/my-study/semester?semester=${semNumber}`)}
                          className="text-base font-bold text-slate-900 group-hover:text-[var(--primary)] transition-colors line-clamp-1 cursor-pointer"
                          title={`View Semester ${semNumber} notes`}
                        >
                          {sem.name || `Semester ${semNumber}`}
                        </h3>

                        {/* Notes Count */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{sem.noteCount} Notes uploaded</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const courseParam = selectedCourse?.slug || selectedCourse?.name || '';
                          navigate(
                            courseParam
                              ? `/student/add-notes?step=3&course=${encodeURIComponent(courseParam)}&semester=${semNumber}`
                              : `/student/add-notes?step=3&semester=${semNumber}`
                          );
                        }}
                        className="py-1.5 px-2.5 text-xs font-semibold text-[var(--primary)] hover:bg-[var(--secondary-light)] bg-[var(--primary-light)] transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                        title={`Upload note in ${sem.name || `Semester ${semNumber}`}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Upload Note</span>
                      </button>
                    </div>

                    {/* Subject Names List */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>Subjects with Notes</span>
                        <span>{semSubjects.length}</span>
                      </div>

                      {semSubjects.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No notes uploaded in subjects yet</p>
                      ) : (
                        <ul className="space-y-1">
                          {semSubjects.map((sub) => (
                            <li
                              key={sub._id}
                              className="text-xs font-medium text-slate-700 hover:text-[var(--primary)] flex items-center justify-between gap-1.5 transition-colors group/item"
                            >
                              <div
                                onClick={() =>
                                  navigate(
                                    `/student/my-study/semester?semester=${semNumber}&subject=${encodeURIComponent(
                                      sub.name
                                    )}`
                                  )
                                }
                                className="flex items-center gap-1.5 truncate cursor-pointer hover:underline flex-1"
                                title={`View ${sub.name} notes`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0" />
                                <span className="truncate">{sub.name}</span>
                                {sub.subjectCode && (
                                  <span className="text-[10px] text-slate-400 shrink-0 uppercase">
                                    ({sub.subjectCode})
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {sub.noteCount} {sub.noteCount === 1 ? 'note' : 'notes'}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const courseParam = selectedCourse?.slug || selectedCourse?.name || '';
                                    navigate(
                                      courseParam
                                        ? `/student/add-notes?step=4&course=${encodeURIComponent(courseParam)}&semester=${semNumber}&subject=${encodeURIComponent(sub.name)}`
                                        : `/student/add-notes?step=4&semester=${semNumber}&subject=${encodeURIComponent(sub.name)}`
                                    );
                                  }}
                                  className="p-1 rounded text-slate-400 hover:text-[var(--primary)] hover:bg-[var(--primary-light)] transition-colors cursor-pointer"
                                  title={`Upload note for ${sub.name}`}
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
 
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyStudyPage;