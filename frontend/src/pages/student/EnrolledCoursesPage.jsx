import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { EmptyState } from '../../components/common/EmptyState';
import { PdfView } from '../../components/common/PdfView';
import {
  fetchEnrolledData,
  setSearchQuery,
  setSelectedCourseFilter,
  setSelectedSemesterFilter,
  resetEnrolledFilters,
  selectEnrolledLoading,
  selectEnrolledCoursesList,
  selectEnrolledNotes,
  selectFilteredEnrolledNotes,
  selectEnrolledStats,
  selectEnrolledSearchQuery,
  selectSelectedCourseFilter,
  selectSelectedSemesterFilter,
  selectEnrolledActiveView,
} from '../../store/slices/enrolledSlice';
import {
  BookOpen,
  Search,
  FileText,
  Eye,
  RotateCcw,
  CheckCircle2,
  Compass,
  Loader2,
  Layers,
  Table as TableIcon,
} from 'lucide-react';

export const EnrolledCoursesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Selectors from Redux store (Memoized & High Performance)
  const loading = useSelector(selectEnrolledLoading);
  const enrolledCoursesList = useSelector(selectEnrolledCoursesList);
  const enrolledNotes = useSelector(selectEnrolledNotes);
  const filteredNotes = useSelector(selectFilteredEnrolledNotes);
  const stats = useSelector(selectEnrolledStats);
  const searchQuery = useSelector(selectEnrolledSearchQuery);
  const selectedCourseFilter = useSelector(selectSelectedCourseFilter);
  const selectedSemesterFilter = useSelector(selectSelectedSemesterFilter);
  const activeView = useSelector(selectEnrolledActiveView);

  // Active PDF Viewer state (local UI modal state)
  const [selectedPdfNote, setSelectedPdfNote] = useState(location.state?.note || null);
  // Auto-open PDF and ensure Notes Table is active if arrived with note in state
  useEffect(() => {
    if (location.state?.note) {
      setSelectedPdfNote(location.state.note);
    }
  }, [location.state, dispatch]);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchEnrolledData());
  }, [dispatch]);

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  // Handle Course Filter Change
  const handleCourseFilterChange = (e) => {
    dispatch(setSelectedCourseFilter(e.target.value));
  };

  // Handle Semester Filter Change
  const handleSemesterFilterChange = (e) => {
    dispatch(setSelectedSemesterFilter(e.target.value));
  };

  // Reset Filters
  const handleResetFilters = () => {
    dispatch(resetEnrolledFilters());
  };

  const hasActiveFilters =
    Boolean(searchQuery) || selectedCourseFilter !== 'ALL' || selectedSemesterFilter !== 'ALL';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb */}
      <Breadcrumb items={[{ label: 'Enrolled Notes' }]} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Enrolled Notes</span>
            
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse curriculum notes
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Switch View Buttons */}
          <div className="flex items-center border border-slate-200 bg-white p-0.5">
            <button
              type="button"
              onClick={() => dispatch(setActiveView('notes'))}
              className={`px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeView === 'notes'
                  ? 'bg-[var(--primary)] text-white'
                  : 'text-slate-600 hover:text-slate-900 bg-transparent'
              }`}
              title="Table View (Notes)"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Notes Table</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate('/explore')}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Explore More</span>
          </button>
        </div>
      </div>

      {/* ================= STATS SUMMARY CARDS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 p-3.5 sm:p-4 flex items-center gap-3 shadow-xs">
          <div className="p-2 sm:p-2.5 bg-blue-50 text-blue-600 border border-blue-200 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Enrolled Notes
            </p>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">{stats.totalCourses}</h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 sm:p-4 flex items-center gap-3 shadow-xs">
          <div className="p-2 sm:p-2.5 bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Available Notes
            </p>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">{stats.totalNotes}</h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 sm:p-4 flex items-center gap-3 shadow-xs">
          <div className="p-2 sm:p-2.5 bg-indigo-50 text-indigo-600 border border-indigo-200 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Subjects Covered
            </p>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">{stats.totalSubjects}</h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 sm:p-4 flex items-center gap-3 shadow-xs">
          <div className="p-2 sm:p-2.5 bg-amber-50 text-amber-600 border border-amber-200 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Access Permission
            </p>
            <h3 className="text-sm font-bold text-emerald-600 flex items-center gap-1">
              <span>Full Unlocked</span>
            </h3>
          </div>
        </div>
      </div>

      {/* ================= SEARCH & FILTER BAR ================= */}
      <div className="bg-white border border-slate-200 p-4 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Live Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search notes by title, topic, subject, or author..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-[var(--primary)] transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Course Filter */}
            <select
              value={selectedCourseFilter}
              onChange={handleCourseFilterChange}
              className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700 outline-none cursor-pointer focus:border-[var(--primary)] transition-all max-w-[190px] truncate"
              title="Filter by Enrolled Course"
            >
              <option value="ALL">All Enrolled Notes</option>
              {enrolledCoursesList.map((course) => {
                const cId = course._id || course.id;
                return (
                  <option key={cId} value={cId}>
                    {course.name || course.courseCode || 'Course'}
                  </option>
                );
              })}
            </select>

            {/* Semester Filter */}
            <select
              value={selectedSemesterFilter}
              onChange={handleSemesterFilterChange}
              className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700 outline-none cursor-pointer focus:border-[var(--primary)] transition-all"
              title="Filter by Semester"
            >
              <option value="ALL">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  Sem {num}
                </option>
              ))}
            </select>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="p-2 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer shrink-0"
                title="Reset filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Counter Info Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <div>
            Showing <strong className="text-slate-900 font-bold">{filteredNotes.length}</strong> of{' '}
            {enrolledNotes.length} enrolled notes
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <span className="text-[11px] text-blue-700 font-semibold bg-blue-50 border border-blue-200 px-2 py-0.5">
                Filtered Results
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT VIEWS ================= */}
      {loading ? (
        <div className="py-24 text-center space-y-3 bg-white border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)] mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading enrolled courses and notes...</p>
        </div>
      ) :  enrolledNotes.length === 0 ? (
        /* ================= EMPTY NOTES FOR ENROLLED COURSES ================= */
        <EmptyState
          icon={FileText}
          title="No notes uploaded for your enrolled courses"
          description="You are enrolled in courses, but no study notes have been uploaded to them yet. You can check back soon or explore other curriculum courses."
          actionLabel="Explore Courses"
          onAction={() => navigate('/explore')}
        />
      ) : filteredNotes.length === 0 ? (
        /* ================= FILTER NO MATCHES ================= */
        <div className="bg-white border border-dashed border-slate-200 p-12 text-center space-y-3">
          <Search className="w-10 h-10 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No matching notes found</h3>
            <p className="text-xs text-slate-500">
              No enrolled notes matched your search query or filter selection.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-colors cursor-pointer"
          >
            Clear Search & Filters
          </button>
        </div>
      ) : (
        /* ================= VIEW 2: NOTES TABLE FORM ================= */
        <div className="bg-white border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              {/* Table Header */}
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 min-w-[240px]">Note Title & Overview</th>
                  <th className="py-3 px-4 min-w-[140px]">Course</th>
                  <th className="py-3 px-4 whitespace-nowrap">Semester</th>
                  <th className="py-3 px-4 min-w-[140px]">Subject</th>
                  <th className="py-3 px-4 whitespace-nowrap">Author</th>
                  <th className="py-3 px-4 whitespace-nowrap">Format</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100">
                {filteredNotes.map((note) => {
                  const noteId = note._id || note.id;
                  const courseName =
                    typeof note.course === 'object' && note.course !== null
                      ? note.course.name || note.course.courseCode || 'Course'
                      : note.course || 'Course';

                  const subjectName =
                    typeof note.subject === 'object' && note.subject !== null
                      ? note.subject.name || 'Subject'
                      : note.subject || 'Subject';

                  const semNum =
                    typeof note.semester === 'object' && note.semester !== null
                      ? note.semester.semesterNumber || 1
                      : Number(note.semester) || 1;

                  const authorName =
                    typeof note.owner === 'object' && note.owner !== null
                      ? note.owner.name || 'Scholar'
                      : note.owner || 'Scholar';

                  const fileExt = (note.fileType || 'PDF').toUpperCase();

                  return (
                    <tr
                      key={noteId}
                      onClick={() => setSelectedPdfNote(note)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* Note Title & Description */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-2.5">
                          <div className="p-1.5 bg-red-50 text-red-600 border border-red-200 shrink-0 mt-0.5">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[var(--primary)] transition-colors line-clamp-1">
                              {note.title}
                            </h4>
                            {note.description ? (
                              <p className="text-[11px] text-slate-400 line-clamp-1">
                                {note.description}
                              </p>
                            ) : (
                              <p className="text-[11px] text-slate-300 italic">No description</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Course */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-800 truncate block max-w-[160px]">
                          {courseName}
                        </span>
                      </td>

                      {/* Semester */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 font-semibold bg-slate-100 text-slate-700">
                          Sem {semNum}
                        </span>
                      </td>

                      {/* Subject */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-medium text-slate-700 truncate block max-w-[160px]">
                          {subjectName}
                        </span>
                      </td>

                      {/* Author */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                        {authorName}
                      </td>

                      {/* File Format Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 text-[10px] font-black tracking-wider bg-red-600 text-white">
                          {fileExt}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPdfNote(note);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
                            title="Open in PDF Viewer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View PDF</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Normal Unlocked PDF Viewer Modal (Since student is enrolled) */}
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

export default EnrolledCoursesPage;
