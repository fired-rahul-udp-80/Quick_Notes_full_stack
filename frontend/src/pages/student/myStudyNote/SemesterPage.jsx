import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumb } from '../../../components/common/Breadcrumb';
import { PdfView } from '../../../components/common/PdfView';
import {
  fetchMyCourses,
  fetchSemestersByCourse,
  fetchSubjectsBySemester,
  setSelectedCourse,
} from '../../../store/slices/courseSlice';
import { noteApi } from '../../../services/noteApi';
import {
  BookOpen,
  Eye,
  Plus,
  Loader2,
  ArrowLeft,
  FileText,
  Download
} from 'lucide-react';

export const SemesterPage = () => {
  const { semesterId: pathSemesterId, subjectId: pathSubjectId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Support query params (?semester=1&subject=math) as well as route params (:semesterId, :subjectId)
  const semesterParam = searchParams.get('semester') || pathSemesterId;
  const subjectParam = searchParams.get('subject') || pathSubjectId;

  // Read academic state from courseSlice
  const {
    myCourses,
    selectedCourse,
    semesters,
    subjectsBySemester,
    loading: courseLoading
  } = useSelector((state) => state.course);

  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [selectedPdfNote, setSelectedPdfNote] = useState(null);

  // 1. Ensure courses are loaded in Redux
  useEffect(() => {
    if (!myCourses || myCourses.length === 0) {
      dispatch(fetchMyCourses());
    }
  }, [dispatch, myCourses?.length]);

  // 2. Ensure an active course is selected
  useEffect(() => {
    if (myCourses?.length > 0 && !selectedCourse) {
      dispatch(setSelectedCourse(myCourses[0]));
    }
  }, [myCourses, selectedCourse, dispatch]);

  // 3. Ensure semesters for the selected course are loaded
  useEffect(() => {
    if (selectedCourse?._id && semesters.length === 0) {
      dispatch(fetchSemestersByCourse(selectedCourse._id));
    }
  }, [selectedCourse?._id, semesters.length, dispatch]);

  // 4. Resolve current semester from Redux semesters list (supports semesterNumber, _id, or name)
  const currentSemester = useMemo(() => {
    if (!semesters || semesters.length === 0 || !semesterParam) return null;
    const cleanParam = decodeURIComponent(String(semesterParam)).trim().toLowerCase();
    return (
      semesters.find((s) => String(s.semesterNumber) === cleanParam) ||
      semesters.find((s) => s._id === semesterParam) ||
      semesters.find((s) => s.name?.toLowerCase() === cleanParam) ||
      null
    );
  }, [semesters, semesterParam]);

  // Guard against non-ObjectId values (e.g. "1") when calling backend APIs
  const resolvedSemesterId =
    currentSemester?._id ||
    (/^[0-9a-fA-F]{24}$/.test(semesterParam) ? semesterParam : null);

  // 5. Read subjects for this semester from Redux cache
  const subjects = useMemo(() => {
    if (!resolvedSemesterId) return [];
    return subjectsBySemester[resolvedSemesterId] || [];
  }, [subjectsBySemester, resolvedSemesterId]);

  // 6. Fetch subjects via courseSlice if not yet cached in Redux
  useEffect(() => {
    if (resolvedSemesterId && !subjectsBySemester[resolvedSemesterId]) {
      dispatch(fetchSubjectsBySemester(resolvedSemesterId));
    }
  }, [resolvedSemesterId, subjectsBySemester, dispatch]);

  // Specific subject resolution when subjectParam is in URL (supports name, subjectCode, slug, or _id)
  const currentSubject = useMemo(() => {
    if (!subjectParam || !subjects || subjects.length === 0) return null;
    const cleanParam = decodeURIComponent(String(subjectParam)).trim().toLowerCase();
    return (
      subjects.find((s) => s.name?.toLowerCase() === cleanParam) ||
      subjects.find((s) => s.subjectCode?.toLowerCase() === cleanParam) ||
      subjects.find((s) => s.slug?.toLowerCase() === cleanParam) ||
      subjects.find((s) => s._id === subjectParam) ||
      null
    );
  }, [subjects, subjectParam]);

  const resolvedSubjectId =
    currentSubject?._id ||
    (/^[0-9a-fA-F]{24}$/.test(subjectParam) ? subjectParam : null);

  // Filter display list: if subjectParam is provided, show only that specific subject
  const displaySubjects = useMemo(() => {
    if (!subjectParam) return subjects;
    if (currentSubject) return [currentSubject];
    return [];
  }, [subjects, subjectParam, currentSubject]);

  // 7. Fetch notes: when subjectParam is present, fetch specifically for that subject
  useEffect(() => {
    let isMounted = true;
    const fetchNotes = async () => {
      if (!resolvedSemesterId) return;
      // If a subject is specified in URL, wait until it resolves to avoid loading all notes first
      if (subjectParam && !resolvedSubjectId) return;

      setNotesLoading(true);
      try {
        const queryParams = {
          semester: resolvedSemesterId,
          all: 'true'
        };
        if (resolvedSubjectId) {
          queryParams.subject = resolvedSubjectId;
        }
        const res = await noteApi.getMyNotes(queryParams);
        if (isMounted) {
          setNotes(res?.data || []);
        }
      } catch (err) {
        console.error('Error loading semester notes:', err);
      } finally {
        if (isMounted) setNotesLoading(false);
      }
    };

    fetchNotes();
    return () => {
      isMounted = false;
    };
  }, [resolvedSemesterId, resolvedSubjectId, subjectParam]);

  // Group notes by subject ID for subject-wise cards
  const notesBySubject = useMemo(() => {
    const map = {};
    (notes || []).forEach((note) => {
      const subId = note.subject?._id || note.subject;
      if (subId) {
        if (!map[subId]) map[subId] = [];
        map[subId].push(note);
      }
    });
    return map;
  }, [notes]);

  const handleOpenNote = useCallback(
    (note) => {
      if (!note) return;
      const enrichedNote = {
        ...note,
        course:
          typeof note.course === 'object' && note.course !== null
            ? note.course
            : selectedCourse || note.course,
        semester:
          typeof note.semester === 'object' && note.semester !== null
            ? note.semester
            : currentSemester || note.semester,
        subject:
          typeof note.subject === 'object' && note.subject !== null
            ? note.subject
            : subjects.find((s) => s._id === (note.subject?._id || note.subject)) || note.subject
      };
      setSelectedPdfNote(enrichedNote);
    },
    [selectedCourse, currentSemester, subjects]
  );

  const isLoading = courseLoading && !currentSemester && (!myCourses || myCourses.length === 0);

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)] mx-auto" />
        <p className="text-sm text-slate-500">Loading semester curriculum & notes...</p>
      </div>
    );
  }

  const semesterDisplayName =
    currentSemester?.name ||
    (currentSemester?.semesterNumber
      ? `Semester ${currentSemester.semesterNumber}`
      : isNaN(Number(semesterParam))
      ? 'Semester'
      : `Semester ${semesterParam}`);

  const navigateToAllSubjects = () => {
    const semNum = currentSemester?.semesterNumber || semesterParam || 1;
    navigate(`/student/my-study/semester?semester=${semNum}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'My Study', onClick: () => navigate('/student/my-study') },
          {
            label: semesterDisplayName,
            onClick: subjectParam ? navigateToAllSubjects : undefined
          },
          ...(currentSubject
            ? [{ label: currentSubject.name }]
            : subjectParam
            ? [{ label: decodeURIComponent(subjectParam) }]
            : [])
        ]}
      />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {currentSubject ? currentSubject.name : semesterDisplayName}
          </h1>
          <p className="text-xs text-slate-500">
            {selectedCourse?.name ? `${selectedCourse.name} • ` : ''}
            {semesterDisplayName}
            {currentSubject?.subjectCode ? ` • (${currentSubject.subjectCode})` : ''}
            {` • ${notes.length} ${notes.length === 1 ? 'Note' : 'Notes'}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {subjectParam ? (
            <button
              onClick={navigateToAllSubjects}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Subjects</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/student/my-study')}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Semesters</span>
            </button>
          )}
          <button
            onClick={() => {
              const courseParam = selectedCourse?.slug || selectedCourse?.name || '';
              navigate(
                courseParam && semesterParam
                  ? `/student/add-notes?step=3&course=${encodeURIComponent(courseParam)}&semester=${encodeURIComponent(semesterParam)}`
                  : '/student/add-notes?step=1'
              );
            }}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Upload Note</span>
          </button>
        </div>
      </div>

      {/* ================= SUBJECT-WISE NOTES ================= */}
      <div className="space-y-6">
        {displaySubjects.length === 0 ? (
          <div className="p-5 text-center bg-white border border-dashed border-slate-200 space-y-3">
            <BookOpen className="w-9 h-9 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800">
                {subjectParam ? 'Subject not found' : `No subjects registered for ${semesterDisplayName}`}
              </h3>
            </div>
            <div className="flex items-center justify-center gap-2">
              {subjectParam && (
                <button
                  onClick={navigateToAllSubjects}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>View All Subjects</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          displaySubjects.map((sub) => {
            const subjectNotes = notesBySubject[sub._id] || [];

            return (
              <div
                key={sub._id}
                className="bg-white border border-slate-200/90 px-2 py-2"
              >
                {/* Subject Header */}
                <div className="flex items-center justify-between border-b border-slate-100 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[var(--primary-light)] text-[var(--primary-dark)] font-bold text-xs flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-base font-bold text-slate-900 leading-snug">
                        {sub.name}
                      </h2>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {sub.subjectCode || 'Active Subject'} • {subjectNotes.length} notes
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const courseParam = selectedCourse?.slug || selectedCourse?.name || '';
                      navigate(
                        courseParam && semesterParam
                          ? `/student/add-notes?step=4&course=${encodeURIComponent(courseParam)}&semester=${encodeURIComponent(semesterParam)}&subject=${encodeURIComponent(sub.name)}`
                          : '/student/add-notes?step=1'
                      );
                    }}
                    className="text-xs font-semibold text-[var(--primary)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Upload Note</span>
                  </button>
                </div>

                {/* Subject Notes Table */}
                {subjectNotes.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      
                      <tbody className="divide-y divide-slate-100">
                        {subjectNotes.map((note) => {
                          const fileExt = (
                            note.fileType ||
                            note.fileName?.split('.').pop() ||
                            'PDF'
                          ).toUpperCase();

                          const orgBadge = note.unitName ? note.unitName : 'General Note';

                          return (
                            <tr
                              key={note._id}
                              className="hover:bg-slate-50/80 transition-colors group"
                            >
                              {/* Title & Description */}
                              <td className="py-2.5 px-3 max-w-xs">
                                <div className="flex items-start gap-2">
                                  <FileText className="w-4 h-4 text-slate-400 group-hover:text-[var(--primary)] shrink-0 mt-0.5 transition-colors" />
                                  <div className="space-y-0.5 truncate">
                                    <h4
                                      className="font-semibold text-slate-800 group-hover:text-[var(--primary)] transition-colors truncate"
                                      title={note.title}
                                    >
                                      {note.title}
                                    </h4>
                                    {note.description && (
                                      <p className="text-[11px] text-slate-400 truncate">
                                        {note.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Organization Type */}
                              <td className="py-2.5 px-3 whitespace-nowrap">
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                                  {orgBadge}
                                </span>
                              </td>

                              {/* File Format Badge */}
                              <td className="py-2.5 px-3 whitespace-nowrap">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--primary-light)] text-[var(--primary-dark)]">
                                  {fileExt}
                                </span>
                              </td>

                              {/* Size / Pages */}
                              <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 text-[11px]">
                                {note.fileSize
                                  ? `${(note.fileSize / (1024 * 1024)).toFixed(1)} MB`
                                  : note.pageCount
                                  ? `${note.pageCount} pgs`
                                  : '—'}
                              </td>

                              {/* Action Link */}
                              <td className="py-2.5 px-3 text-right whitespace-nowrap">
                                {note.fileUrl ? (
                                  <button onClick={() => handleOpenNote(note)} className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-[var(--primary-light)] text-[var(--primary-dark)] hover:bg-[var(--primary)] hover:text-white transition-colors cursor-pointer">
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Open Note</span>
                                  </button>) : (
                                  <span className="text-slate-400 text-[11px]">No file</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-3 text-center text-xs text-slate-400 italic">
                    No notes uploaded for this subject yet.
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* PDF View Modal */}
      {selectedPdfNote && (
        <PdfView
          note={selectedPdfNote}
          isOpen={Boolean(selectedPdfNote)}
          onClose={() => setSelectedPdfNote(null)}
          isLocked={false}
        />
      )}
    </div>
  );
};

export default SemesterPage;
