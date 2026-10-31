import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { NoteCard } from '../../components/common/NoteCard';
import { noteApi } from '../../services/noteApi';
import toast from 'react-hot-toast';
import {
  Search,
  BookOpen,
  FileText,
  Filter,
  Sparkles,
  RefreshCw,
  X,
  Lock,
  ArrowRight,
  GraduationCap,
  Layers,
  Compass
} from 'lucide-react';

export const ExploreNotesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('ALL');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  // If already logged in, redirect directly to dashboard explore
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/student/explore', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Fetch all public notes
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await noteApi.getPublicNotes({ all: 'true' });
      if (res && res.success && Array.isArray(res.data)) {
        setNotes(res.data);
      } else if (Array.isArray(res)) {
        setNotes(res);
      } else {
        setNotes([]);
      }
    } catch (err) {
      console.error('Error fetching public notes:', err);
      toast.error(err.message || 'Failed to load study notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Extract unique courses from notes list
  const coursesList = useMemo(() => {
    const map = new Map();
    notes.forEach((n) => {
      if (typeof n.course === 'object' && n.course !== null) {
        const id = n.course._id || n.course.id;
        const name = n.course.name || n.course.courseCode;
        if (id && name) map.set(id, name);
      } else if (n.courseName) {
        map.set(n.courseName, n.courseName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [notes]);

  // Extract unique subjects from notes list
  const subjectsList = useMemo(() => {
    const map = new Map();
    notes.forEach((n) => {
      if (typeof n.subject === 'object' && n.subject !== null) {
        const id = n.subject._id || n.subject.id;
        const name = n.subject.name || n.subject.subjectCode;
        if (id && name) map.set(id, name);
      } else if (n.subjectName) {
        map.set(n.subjectName, n.subjectName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [notes]);

  // Filter and sort notes
  const filteredNotes = useMemo(() => {
    let list = [...notes];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((n) => {
        const title = (n.title || '').toLowerCase();
        const desc = (n.description || '').toLowerCase();
        const sub = (
          typeof n.subject === 'object' ? n.subject?.name : n.subjectName || ''
        ).toLowerCase();
        const course = (
          typeof n.course === 'object' ? n.course?.name || n.course?.courseCode : n.courseName || ''
        ).toLowerCase();
        return (
          title.includes(q) ||
          desc.includes(q) ||
          sub.includes(q) ||
          course.includes(q)
        );
      });
    }

    // Course filter
    if (selectedCourse !== 'ALL') {
      list = list.filter((n) => {
        const courseId =
          typeof n.course === 'object' && n.course !== null
            ? n.course._id || n.course.id
            : n.courseName;
        return String(courseId) === String(selectedCourse);
      });
    }

    // Subject filter
    if (selectedSubject !== 'ALL') {
      list = list.filter((n) => {
        const subjectId =
          typeof n.subject === 'object' && n.subject !== null
            ? n.subject._id || n.subject.id
            : n.subjectName;
        return String(subjectId) === String(selectedSubject);
      });
    }

    // Sort order
    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'views') {
      list.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === 'downloads') {
      list.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    } else if (sortBy === 'alphabetical') {
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return list;
  }, [notes, searchQuery, selectedCourse, selectedSubject, sortBy]);

  // Click on a single note: If not logged in, redirect to login
  const handleNoteClick = (note) => {
    if (!isAuthenticated) {
      toast('Please log in to preview and download this note', { icon: '🔒' });
      navigate('/login', {
        state: {
          from: location.pathname,
          noteId: note._id || note.id,
          message: 'Please log in to access this note'
        }
      });
    }  
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCourse('ALL');
    setSelectedSubject('ALL');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Public Navbar */}
      <Navbar />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-6 sm:py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-3 text-center">

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Explore University Study Notes
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed">
            Discover peer-reviewed lecture summaries, exam cheat sheets, and course notes.
            Sign in to unlock full document previews and downloads.
          </p>

          {/* Search Bar in Hero */}
          <div className="max-w-4xl mx-auto pt-2">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes by title, subject, or course..."
                className="w-full pl-12 pr-10 py-3.5 bg-slate-800/90 hover:bg-slate-800 focus:bg-slate-800 text-white placeholder:text-slate-400 border border-slate-700/80 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm sm:text-base transition-all shadow-lg"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Filters and Controls Toolbar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Course Filter */}
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="ALL">All Courses ({coursesList.length})</option>
                {coursesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Filter */}
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="ALL">All Subjects ({subjectsList.length})</option>
                {subjectsList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="views">Most Viewed</option>
                <option value="downloads">Most Downloaded</option>
                <option value="alphabetical">Title (A - Z)</option>
              </select>
            </div>
          </div>

          {/* Right Counts & Refresh */}
          <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Showing <span className="text-slate-900 dark:text-slate-100 font-bold">{filteredNotes.length}</span> of {notes.length} notes
            </span>

            {(searchQuery || selectedCourse !== 'ALL' || selectedSubject !== 'ALL') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}

            <button
              type="button"
              onClick={fetchNotes}
              disabled={loading}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Refresh notes list"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : ''}`} />
            </button>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 space-y-4 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded-md" />
                </div>
                <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
                <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/60 rounded-md" />
                <div className="h-4 w-2/3 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                  <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  <div className="h-4 w-14 bg-slate-200 dark:bg-slate-800 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredNotes.length === 0 && (
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
              No matching notes found
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Try adjusting your search terms or resetting the course and subject filters.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-slate-950 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

        {/* Notes Grid */}
        {!loading && filteredNotes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id || note.id}
                note={note}
                onOpen={() => handleNoteClick(note)}
                
              />
            ))}
          </div>
        )}

        {/* Bottom Banner for Guests */}
        {!isAuthenticated && (
          <div className="mt-12 p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mb-1">
                <Lock className="w-3.5 h-3.5" />
                <span>Full Note Access</span>
              </div>
              <h3 className="text-xl font-extrabold tracking-tight">
                Unlock Complete Lecture Notes & Downloads
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
                Create a student account or sign in to bookmark notes, track progress, join study rooms,
                and download verified study materials.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
              >
                Sign In to Read
              </button>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Public Footer */}
      <Footer />
    </div>
  );
};

export default ExploreNotesPage;
