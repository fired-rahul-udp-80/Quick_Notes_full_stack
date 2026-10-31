import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { NoteCard } from '../../components/common/NoteCard';
import { academicApi } from '../../services/academicApi';
import { noteApi } from '../../services/noteApi';
import { toast } from 'react-hot-toast';
import {
  BookOpen,
  GraduationCap,
  Users,
  FileText,
  Layers,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  RefreshCw,
  X,
  Compass,
  ChevronRight,
  Calendar
} from 'lucide-react';

export const CourseDetailsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [courses, setCourses] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'ACADEMIC' | 'SKILL'

  // Selected course details
  const [selectedCourseId, setSelectedCourseId] = useState(searchParams.get('courseId') || null);
  const [courseSemesters, setCourseSemesters] = useState([]);
  const [loadingSemesters, setLoadingSemesters] = useState(false);

  // Fetch all courses and notes from backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesRes, notesRes] = await Promise.allSettled([
        academicApi.getAllCourses({ all: 'true' }),
        noteApi.getPublicNotes({ all: 'true' })
      ]);

      const fetchedCourses =
        coursesRes.status === 'fulfilled' && coursesRes.value?.success && Array.isArray(coursesRes.value.data)
          ? coursesRes.value.data
          : [];

      const fetchedNotes =
        notesRes.status === 'fulfilled' && notesRes.value?.success && Array.isArray(notesRes.value.data)
          ? notesRes.value.data
          : [];

      setCourses(fetchedCourses);
      setAllNotes(fetchedNotes);

      // Default select the first course or from URL param if available
      const paramId = searchParams.get('courseId');
      if (paramId && fetchedCourses.some((c) => String(c._id || c.id) === String(paramId))) {
        setSelectedCourseId(paramId);
      } else if (fetchedCourses.length > 0 && !selectedCourseId) {
        setSelectedCourseId(fetchedCourses[0]._id || fetchedCourses[0].id);
      }
    } catch (err) {
      console.error('Error loading courses:', err);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch semesters whenever selected course changes
  useEffect(() => {
    if (!selectedCourseId) {
      setCourseSemesters([]);
      return;
    }

    let isMounted = true;
    const fetchSemesters = async () => {
      setLoadingSemesters(true);
      try {
        const res = await academicApi.getSemestersByCourse(selectedCourseId);
        if (isMounted) {
          if (res && res.success && Array.isArray(res.data)) {
            setCourseSemesters(res.data);
          } else {
            setCourseSemesters([]);
          }
        }
      } catch (err) {
        console.warn('Could not load semesters for course:', err);
        if (isMounted) setCourseSemesters([]);
      } finally {
        if (isMounted) setLoadingSemesters(false);
      }
    };

    fetchSemesters();

    return () => {
      isMounted = false;
    };
  }, [selectedCourseId]);

  // Compute notes count map per course
  const notesCountMap = useMemo(() => {
    const counts = {};
    allNotes.forEach((n) => {
      const cId = typeof n.course === 'object' && n.course !== null ? n.course._id || n.course.id : n.course;
      if (cId) {
        counts[cId] = (counts[cId] || 0) + 1;
      }
    });
    return counts;
  }, [allNotes]);

  // Filter courses based on search and type
  const filteredCourses = useMemo(() => {
    let list = [...courses];

    if (filterType !== 'ALL') {
      list = list.filter((c) => (c.courseType || 'ACADEMIC').toUpperCase() === filterType);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          (c.name || '').toLowerCase().includes(q) ||
          (c.slug || '').toLowerCase().includes(q) ||
          (c.courseType || '').toLowerCase().includes(q)
      );
    }

    return list;
  }, [courses, filterType, searchQuery]);

  // Active selected course object
  const activeCourse = useMemo(() => {
    if (!selectedCourseId) return courses[0] || null;
    return courses.find((c) => String(c._id || c.id) === String(selectedCourseId)) || courses[0] || null;
  }, [courses, selectedCourseId]);

  // Notes belonging to active selected course
  const activeCourseNotes = useMemo(() => {
    if (!activeCourse) return [];
    const activeId = String(activeCourse._id || activeCourse.id);
    return allNotes.filter((n) => {
      const cId = typeof n.course === 'object' && n.course !== null ? n.course._id || n.course.id : n.course;
      return String(cId) === activeId;
    });
  }, [allNotes, activeCourse]);

  const handleSelectCourse = (course) => {
    const id = course._id || course.id;
    setSelectedCourseId(id);
    setSearchParams({ courseId: id });
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  const handleNoteClick = (note) => {
    if (!isAuthenticated) {
      toast('Please log in to access notes');
      navigate('/login', {
        state: {
          from: '/course-details',
          noteId: note._id || note.id
        }
      });
    } else {
      navigate(`/student/explore`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased transition-colors duration-200">
      <Navbar />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Explore All Courses & Degree Tracks
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed">
            Browse verified courses from the curriculum. Explore structured semesters, modules,
            and shared student notes for every degree program.
          </p>

          {/* Search bar inside Hero */}
          <div className="max-w-4xl mx-auto pt-2">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses by name or keyword..."
                className="w-full pl-11 pr-10 py-3 bg-slate-800/90 text-white placeholder:text-slate-400 border border-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Navigation Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Explore Notes', onClick: () => navigate('/explore') },
            { label: 'All Courses', onClick: () => setSelectedCourseId(null) },
            ...(activeCourse ? [{ label: activeCourse.name }] : [])
          ]}
        />

        {/* Selected Course Overview Hero Card (if active) */}
        {activeCourse && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 text-xs font-bold bg-primary-light text-primary-dark dark:bg-primary-dark/40 dark:text-yellow-200 border border-primary-border/60 dark:border-primary/40">
                    {activeCourse.courseType || 'ACADEMIC'}
                  </span>
                  {activeCourse.isPublished && (
                    <span className="px-3 py-1 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Active Track
                    </span>
                  )}
                  {activeCourse.slug && (
                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                      /{activeCourse.slug}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {activeCourse.name}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Comprehensive academic curriculum for {activeCourse.name}. Review available semester syllabi,
                  lecture notes, and study guides prepared by students and faculty.
                </p>

                {/* Course Quick Stats */}
                <div className="flex items-center gap-6 pt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-primary" />
                    <span>
                      <strong className="text-slate-900 dark:text-white">
                        {notesCountMap[activeCourse._id || activeCourse.id] || 0}
                      </strong>{' '}
                      Study Notes
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>
                      <strong className="text-slate-900 dark:text-white">
                        {courseSemesters.length || 0}
                      </strong>{' '}
                      Semesters
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
                <button
                  type="button"
                  onClick={() => navigate('/explore')}
                  className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-hover text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore Notes Catalog</span>
                </button>
              </div>
            </div>

            {/* Semesters / Modules Tabs or Cards for Active Course */}
            {courseSemesters.length > 0 && (
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-primary" />
                  <span>Curriculum Semesters</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
                  {courseSemesters.map((sem) => (
                    <div
                      key={sem._id || sem.id}
                      className="p-3 text-center border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-primary/50 transition-all"
                    >
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Sem</div>
                      <div className="text-base font-extrabold text-slate-800 dark:text-slate-200">
                        {sem.semesterNumber || sem.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* ALL COURSES SECTION (From Course Model) */}
        {/* ==================================================== */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <span>All Degree Courses ({filteredCourses.length})</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Select any course to view its curriculum, semesters, and notes.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  filterType === 'ALL'
                    ? 'bg-primary text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilterType('ACADEMIC')}
                className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  filterType === 'ACADEMIC'
                    ? 'bg-primary text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Academic
              </button>
              <button
                type="button"
                onClick={() => setFilterType('SKILL')}
                className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  filterType === 'SKILL'
                    ? 'bg-primary text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Skill Based
              </button>
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 animate-pulse"
                >
                  <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800" />
                  <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800" />
                  <div className="h-4 w-1/2 bg-slate-100 dark:bg-slate-800/60" />
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800" />
                    <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredCourses.length === 0 && (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <BookOpen className="w-10 h-10 text-primary mx-auto opacity-50" />
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                No courses match your criteria
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching with another keyword or resetting the category filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('ALL');
                }}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Courses Grid */}
          {!loading && filteredCourses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCourses.map((course) => {
                const cId = course._id || course.id;
                const isSelected = activeCourse && String(activeCourse._id || activeCourse.id) === String(cId);
                const count = notesCountMap[cId] || 0;

                return (
                  <div
                    key={cId}
                    onClick={() => handleSelectCourse(course)}
                    className={`group bg-white dark:bg-slate-900 border p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/40 bg-primary/5 dark:bg-primary/5'
                        : 'border-slate-200/80 dark:border-slate-800 hover:border-primary/60'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 text-[11px] font-bold bg-primary-light text-primary-dark dark:bg-primary-dark/40 dark:text-yellow-200 border border-primary-border/60 dark:border-primary/40">
                          {course.courseType || 'ACADEMIC'}
                        </span>
                        {course.isPublished ? (
                          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Verified
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-slate-400">
                            Draft Track
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors line-clamp-2">
                        {course.name}
                      </h3>

                      {course.slug && (
                        <p className="text-xs text-slate-400 font-mono">
                          /{course.slug}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 font-medium">
                        <FileText className="w-4 h-4 text-primary" />
                        <span><strong>{count}</strong> notes</span>
                      </div>

                      <span className="text-primary font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>{isSelected ? 'Selected' : 'View Track'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Course Notes Section (if notes exist for active course) */}
        {activeCourse && activeCourseNotes.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <span>Notes in {activeCourse.name} ({activeCourseNotes.length})</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Click any note to preview details or log in to download.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/explore')}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>View All Notes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeCourseNotes.slice(0, 6).map((note) => (
                <NoteCard
                  key={note._id || note.id}
                  note={note}
                  onOpen={() => handleNoteClick(note)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetailsPage;
