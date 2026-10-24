import React, { useState, useMemo } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { NoteCard } from '../../components/common/NoteCard';
 
import { ENROLLED_COURSES, SUBJECTS_BY_SEMESTER } from '../../data/mockData';
import {
  Search,
  Filter,
  ArrowUpDown,
  BookOpen,
  Layers,
  FileText,
  SlidersHorizontal,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export const ExploreNotesPage = () => {
  const { notes, searchQuery, setSearchQuery, navigate, isAuthenticated } = useApp();

  const [localSearch, setLocalSearch] = useState(searchQuery || '');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState('ALL');
  const [selectedFileTypeFilter, setSelectedFileTypeFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('relevant'); // 'relevant', 'newest', 'views'
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'notes', 'courses', 'subjects'

  // Filter public notes
  const filteredNotes = useMemo(() => {
    let result = notes.filter((n) => n.visibility === 'PUBLIC');

    const query = localSearch.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.subject.toLowerCase().includes(query) ||
          n.course.toLowerCase().includes(query) ||
          (n.lecture && n.lecture.toLowerCase().includes(query)) ||
          n.owner.toLowerCase().includes(query)
      );
    }

    if (selectedCourseFilter !== 'ALL') {
      result = result.filter((n) => n.course.toLowerCase().includes(selectedCourseFilter.toLowerCase()));
    }

    if (selectedSemesterFilter !== 'ALL') {
      result = result.filter((n) => n.semester === Number(selectedSemesterFilter));
    }

    if (selectedFileTypeFilter !== 'ALL') {
      result = result.filter((n) => n.fileType === selectedFileTypeFilter);
    }

    if (sortBy === 'newest') {
      // simulate newest
      result = [...result].reverse();
    } else if (sortBy === 'views') {
      result = [...result].sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    return result;
  }, [notes, localSearch, selectedCourseFilter, selectedSemesterFilter, selectedFileTypeFilter, sortBy]);

  // Matching Courses
  const matchedCourses = useMemo(() => {
    const q = localSearch.trim().toLowerCase();
    if (!q) return ENROLLED_COURSES;
    return ENROLLED_COURSES.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [localSearch]);

  // Matching Subjects
  const allFlattenedSubjects = useMemo(() => {
    const subs = [];
    Object.entries(SUBJECTS_BY_SEMESTER).forEach(([sem, list]) => {
      list.forEach((sub) => {
        subs.push({ ...sub, semester: Number(sem) });
      });
    });
    return subs;
  }, []);

  const matchedSubjects = useMemo(() => {
    const q = localSearch.trim().toLowerCase();
    if (!q) return allFlattenedSubjects;
    return allFlattenedSubjects.filter(
      (s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    );
  }, [localSearch, allFlattenedSubjects]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {!isAuthenticated && <Navbar />}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header & Large Search Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 shadow-xs">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Community Knowledge Repository
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Explore Academic Notes & Courses
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Discover verified lecture notes, handwritten sheets, and topic summaries shared across courses.
            </p>

            {/* Large Search Bar */}
            <div className="pt-4 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  setSearchQuery(e.target.value);
                }}
                placeholder="Search notes, subjects, courses (e.g. C++, Operators, Pointers)..."
                className="w-full pl-12 pr-4 py-3.5 text-sm sm:text-base bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition-all shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Filters and Sorting Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Results' },
              { id: 'notes', label: `Notes (${filteredNotes.length})` },
              { id: 'courses', label: `Courses (${matchedCourses.length})` },
              { id: 'subjects', label: `Subjects (${matchedSubjects.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filters Selectors */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 font-medium text-slate-700 outline-none"
            >
              <option value="ALL">All Courses</option>
              <option value="B.Tech CSE">B.Tech CSE</option>
              <option value="B.Tech ECE">B.Tech ECE</option>
              <option value="BCA">BCA</option>
              <option value="MCA">MCA</option>
            </select>

            <select
              value={selectedSemesterFilter}
              onChange={(e) => setSelectedSemesterFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 font-medium text-slate-700 outline-none"
            >
              <option value="ALL">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>

            <select
              value={selectedFileTypeFilter}
              onChange={(e) => setSelectedFileTypeFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 font-medium text-slate-700 outline-none"
            >
              <option value="ALL">All Files</option>
              <option value="PDF">PDF Documents</option>
              <option value="DOCX">DOCX Files</option>
              <option value="PNG">Image Scans</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 font-medium text-slate-700 outline-none"
            >
              <option value="relevant">Most Relevant</option>
              <option value="newest">Newest First</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>

        {/* RESULTS SECTIONS */}
        <div className="space-y-10">
          {/* 1. COURSES SECTION */}
          {(activeTab === 'all' || activeTab === 'courses') && matchedCourses.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Featured Courses</h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">{matchedCourses.length} courses available</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {matchedCourses.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                        <span className="font-semibold text-indigo-600">{c.program}</span>
                        <span>{c.notesCount} Notes</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 leading-snug">{c.title}</h4>
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {c.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">{c.enrolledStudents} students</span>
                      <button
                        onClick={() => navigate('course-details', { courseId: c.id })}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>Explore</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. SUBJECTS SECTION */}
          {(activeTab === 'all' || activeTab === 'subjects') && matchedSubjects.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Curriculum Subjects</h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">{matchedSubjects.length} subjects found</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchedSubjects.map((s) => (
                  <div
                    key={`${s.id}-${s.semester}`}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-indigo-300 transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {s.code}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          Semester {s.semester}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{s.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {s.lecturesCount} lectures • {s.notesCount} notes
                      </p>
                    </div>

                    <button
                      onClick={() => navigate('subject', { semester: s.semester, subjectId: s.id })}
                      className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-xl border border-indigo-200 transition-colors cursor-pointer"
                    >
                      Open
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. NOTES SECTION */}
          {(activeTab === 'all' || activeTab === 'notes') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Community Notes</h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">{filteredNotes.length} notes listed</span>
              </div>

              {filteredNotes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onOpen={() => navigate('note-preview', { noteId: note.id })}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                  <p className="text-sm text-slate-500">No notes found matching your search query.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {!isAuthenticated && <Footer />}
    </div>
  );
};
