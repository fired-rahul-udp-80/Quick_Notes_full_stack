import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { NoteCard } from '../../components/common/NoteCard';
 
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

export const CourseDetailsPage = () => {
  const {
    activeCourse,
    enrolledCourseIds,
    toggleEnrollCourse,
    notes,
    navigate,
    isAuthenticated
  } = useApp();

  const isEnrolled = enrolledCourseIds.includes(activeCourse.id);

  // Sample public notes for this course topic
  const sampleNotes = notes.filter((n) => n.visibility === 'PUBLIC').slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {!isAuthenticated && <Navbar />}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Breadcrumb
          items={[
            { label: 'Explore Courses', onClick: () => navigate('explore') },
            { label: activeCourse.title }
          ]}
        />

        {/* Hero Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {activeCourse.program}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  {activeCourse.category}
                </span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Study Track
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {activeCourse.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {activeCourse.description}
              </p>

              {/* Course Meta Stats */}
              <div className="flex items-center gap-6 pt-2 text-xs sm:text-sm text-slate-500 font-medium flex-wrap">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span><strong>{activeCourse.notesCount}</strong> Notes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span><strong>{activeCourse.topicsCount}</strong> Subjects/Topics</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span><strong>{activeCourse.enrolledStudents}</strong> Students</span>
                </div>
              </div>
            </div>

            {/* CTA Box */}
            <div className="w-full lg:w-auto p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-3 shrink-0 text-center lg:text-left min-w-[240px]">
              <div className="text-xs text-slate-500">Self-Paced Academic Study</div>
              <div className="text-2xl font-bold text-slate-900">100% Free</div>
              <button
                onClick={() => toggleEnrollCourse(activeCourse.id)}
                className={`w-full py-3 px-5 text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-xs ${
                  isEnrolled
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isEnrolled ? '✓ Enrolled in Dashboard' : 'Enroll for Free'}
              </button>
              <p className="text-[11px] text-slate-400">
                {isEnrolled ? 'Access anytime from your Enrolled Courses' : 'Instant access • No fees or credit card required'}
              </p>
            </div>
          </div>
        </div>

        {/* Course Structure / Syllabus */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Course Structure & Curriculum</h3>
                <span className="text-xs text-slate-500 font-medium">{activeCourse.syllabus?.length || 7} Modules</span>
              </div>

              <div className="space-y-3">
                {(activeCourse.syllabus || [
                  { title: 'C++ Basics & Syntax', notes: 14, topics: 'Variables, datatypes, control flow, functions' },
                  { title: 'Object Oriented Programming (OOP)', notes: 22, topics: 'Classes, objects, constructor types, destructor' },
                  { title: 'Classes & Objects in Depth', notes: 18, topics: 'Access specifiers, friend functions, static members' },
                  { title: 'Inheritance & Ambiguity Resolution', notes: 16, topics: 'Single, multiple, multilevel, virtual base classes' },
                  { title: 'Polymorphism & Virtual Functions', notes: 20, topics: 'Function overriding, dynamic dispatch, vtable, pure virtual' },
                  { title: 'Standard Template Library (STL)', notes: 24, topics: 'Vectors, lists, maps, iterators, algorithms' },
                  { title: 'Exception Handling & File Streams', notes: 10, topics: 'Try-catch blocks, custom exceptions, fstream' }
                ]).map((module, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 hover:border-indigo-200 transition-all flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{module.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{module.topics}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 shrink-0 bg-white px-2.5 py-1 rounded-lg border border-slate-200/60">
                      {module.notes} Notes
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Public Note Preview Section before enrollment */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Sample Public Notes</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Preview and read study material from this course before or without enrolling.
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Free Preview
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onOpen={() => navigate('note-preview', { noteId: note.id })}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Info Box */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900">About this Study Track</h4>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Curated by senior university scholars</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Covers mid-term & end-term syllabi</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Downloadable PDF format ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Includes exam-oriented problem questions</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="text-xs text-slate-400 mb-1">Instructor / Curator</div>
                <div className="text-xs font-bold text-slate-800">{activeCourse.instructor || 'School of Computer Science'}</div>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-5 text-xs text-indigo-900 space-y-2">
              <div className="font-bold">Need personal organization?</div>
              <p className="text-indigo-700 leading-relaxed">
                Add this course to your student dashboard to track saved handouts across lectures.
              </p>
              <button
                onClick={() => toggleEnrollCourse(activeCourse.id)}
                className="mt-2 inline-flex items-center gap-1.5 font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                <span>{isEnrolled ? 'View in Dashboard →' : 'Enroll Now →'}</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {!isAuthenticated && <Footer />}
    </div>
  );
};
