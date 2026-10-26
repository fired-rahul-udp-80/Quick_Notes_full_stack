import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { NoteCard } from '../../components/common/NoteCard';
import { toast } from 'react-hot-toast';
import {
  BookOpen,
  Users,
  FileText,
  Layers,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const DEFAULT_COURSE = {
  id: 'course-cpp',
  title: 'C++ Programming & OOP Architecture',
  program: 'B.Tech CSE / BCA',
  category: 'Core Curriculum',
  description: 'Master C++ from fundamental syntax and pointers to object-oriented programming, standard template library (STL), memory management, and competitive problem-solving patterns.',
  notesCount: 124,
  topicsCount: 7,
  enrolledStudents: 340,
  instructor: 'School of Computer Science & Engineering',
  syllabus: [
    { title: 'C++ Basics & Syntax', notes: 14, topics: 'Variables, datatypes, control flow, functions' },
    { title: 'Object Oriented Programming (OOP)', notes: 22, topics: 'Classes, objects, constructor types, destructor' },
    { title: 'Classes & Objects in Depth', notes: 18, topics: 'Access specifiers, friend functions, static members' },
    { title: 'Inheritance & Ambiguity Resolution', notes: 16, topics: 'Single, multiple, multilevel, virtual base classes' },
    { title: 'Polymorphism & Virtual Functions', notes: 20, topics: 'Function overriding, dynamic dispatch, vtable, pure virtual' },
    { title: 'Standard Template Library (STL)', notes: 24, topics: 'Vectors, lists, maps, iterators, algorithms' },
    { title: 'Exception Handling & File Streams', notes: 10, topics: 'Try-catch blocks, custom exceptions, fstream' }
  ]
};

const SAMPLE_NOTES = [
  {
    id: 'sample-1',
    title: 'C++ Operator Overloading & Precedence',
    description: 'Detailed class lecture summary covering unary and binary operator overloading, friend functions, and syntax rules.',
    subject: 'Programming in C++',
    course: 'B.Tech CSE',
    fileType: 'PDF',
    visibility: 'PUBLIC',
    pages: 14,
    owner: { name: 'Rahul Kumar' }
  },
  {
    id: 'sample-2',
    title: 'Virtual Functions & Polymorphism Cheat Sheet',
    description: 'Concise revision notes on runtime polymorphism, vptr, vtable mechanism, and pure virtual abstract classes.',
    subject: 'Programming in C++',
    course: 'B.Tech CSE',
    fileType: 'PDF',
    visibility: 'PUBLIC',
    pages: 8,
    owner: { name: 'Aman Verma' }
  }
];

export const CourseDetailsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const activeCourse = DEFAULT_COURSE;

  const handleEnrollToggle = () => {
    if (!isAuthenticated) {
      toast('Please sign in to save this course to your dashboard', { icon: 'ℹ️' });
      navigate('/login');
      return;
    }
    setIsEnrolled((prev) => {
      const next = !prev;
      toast.success(next ? 'Enrolled successfully! Added to your dashboard.' : 'Unenrolled from course');
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#07080b]/90 square-grid-pattern text-slate-900 dark:text-slate-100 flex flex-col antialiased transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Breadcrumb
          items={[
            { label: 'Explore Notes', onClick: () => navigate('/explore') },
            { label: activeCourse.title }
          ]}
        />

        {/* Hero Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-light text-primary-dark dark:bg-primary-dark/40 dark:text-yellow-200 border border-primary-border/60 dark:border-primary/40">
                  {activeCourse.program}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {activeCourse.category}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Study Track
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {activeCourse.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                {activeCourse.description}
              </p>

              {/* Course Meta Stats */}
              <div className="flex items-center gap-6 pt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium flex-wrap">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-primary dark:text-yellow-300" />
                  <span><strong className="text-slate-900 dark:text-white">{activeCourse.notesCount}</strong> Notes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-primary dark:text-yellow-300" />
                  <span><strong className="text-slate-900 dark:text-white">{activeCourse.topicsCount}</strong> Modules</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-primary dark:text-yellow-300" />
                  <span><strong className="text-slate-900 dark:text-white">{activeCourse.enrolledStudents}</strong> Students</span>
                </div>
              </div>
            </div>

            {/* CTA Box */}
            <div className="w-full lg:w-auto p-5 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-3 shrink-0 text-center lg:text-left min-w-[240px]">
              <div className="text-xs text-slate-500 dark:text-slate-400">Self-Paced Academic Study</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">100% Free</div>
              <button
                type="button"
                onClick={handleEnrollToggle}
                className={`w-full py-3 px-5 text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-xs ${
                  isEnrolled
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-primary hover:bg-primary-hover text-white'
                }`}
              >
                {isEnrolled ? '✓ Enrolled in Dashboard' : 'Enroll for Free'}
              </button>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {isEnrolled ? 'Access anytime from your Enrolled Courses' : 'Instant access • No fees or credit card required'}
              </p>
            </div>
          </div>
        </div>

        {/* Course Structure / Syllabus */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Course Structure & Curriculum</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{activeCourse.syllabus.length} Modules</span>
              </div>

              <div className="space-y-3">
                {activeCourse.syllabus.map((module, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-primary-light text-primary-dark dark:bg-primary-dark/40 dark:text-yellow-200 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{module.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{module.topics}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-800">
                      {module.notes} Notes
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Public Note Preview Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Sample Public Notes</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Preview and read study material from this course before or without enrolling.
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800">
                  Free Preview
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SAMPLE_NOTES.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onOpen={() => navigate('/explore')}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Info Box */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">About this Study Track</h4>
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Curated by senior university scholars</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Covers mid-term & end-term syllabi</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Downloadable PDF format ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Includes exam-oriented problem questions</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="text-xs text-slate-400 dark:text-slate-500 mb-1">Instructor / Curator</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{activeCourse.instructor}</div>
              </div>
            </div>

            <div className="bg-primary-light/50 dark:bg-slate-850 rounded-2xl border border-primary-border/60 dark:border-slate-800 p-5 text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <div className="font-bold text-slate-900 dark:text-slate-100">Need personal organization?</div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Add this course to your student dashboard to track saved handouts across lectures.
              </p>
              <button
                type="button"
                onClick={handleEnrollToggle}
                className="mt-2 inline-flex items-center gap-1.5 font-bold text-primary dark:text-yellow-300 hover:underline cursor-pointer"
              >
                <span>{isEnrolled ? 'View in Dashboard →' : 'Enroll Now →'}</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetailsPage;
