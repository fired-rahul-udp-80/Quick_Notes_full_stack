import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
 
import {
  ArrowRight,
  BookOpen,
  Layers,
  UploadCloud,
  Compass,
  Laptop,
  CheckCircle2,
  FileText,
  Search,
  Sparkles,
  Lock,
  Globe,
  GraduationCap
} from 'lucide-react';

export const LandingPage = () => {
 

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-16 pb-20 overflow-hidden bg-gradient-to-b from-white via-indigo-50/30 to-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Subtle Tag badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6 shadow-xs animate-in fade-in slide-in-from-top-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Notes & Course Learning Platform</span>
          </div>

          {/* Main Hero Headings */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            All your notes, <span className="text-indigo-600">organized</span> for learning.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Store, organize and explore course-wise notes in one simple study platform.
          </p>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => navigate('register')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('explore')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Explore Notes</span>
            </button>
          </div>

          {/* ================= CLEAN PRODUCT PREVIEW ILLUSTRATION ================= */}
          <div className="mt-14 relative max-w-4xl mx-auto">
            <div className="relative rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-indigo-950/10 overflow-hidden text-left">
              {/* Fake App Window Titlebar */}
              <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>NIU Notes • B.Tech CSE / Semester 1 / Programming in C</span>
                </div>
                <div className="text-[11px] font-medium text-slate-400">STUDENT DASHBOARD</div>
              </div>

              {/* Product Preview Body */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50/50">
                {/* Left Mini Sidebar Preview */}
                <div className="hidden md:block md:col-span-4 bg-white p-4 rounded-xl border border-slate-200/70 shadow-xs space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Course Hierarchy</div>
                  <div className="space-y-1.5 text-xs font-medium">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-50 text-indigo-700 font-semibold">
                      <span>Programming in C</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-indigo-200/60 rounded">14 notes</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg text-slate-600 hover:bg-slate-50">
                      <span>Mathematics I</span>
                      <span className="text-[10px] text-slate-400">10 notes</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg text-slate-600 hover:bg-slate-50">
                      <span>Physics</span>
                      <span className="text-[10px] text-slate-400">8 notes</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg text-slate-600 hover:bg-slate-50">
                      <span>Digital Logic</span>
                      <span className="text-[10px] text-slate-400">6 notes</span>
                    </div>
                  </div>
                </div>

                {/* Right Interactive Card Preview */}
                <div className="col-span-12 md:col-span-8 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Lecture 3 - Operators & Expressions</h4>
                      <p className="text-xs text-slate-500">2 lecture notes uploaded by Rahul</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                      Verified
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-2 hover:border-indigo-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Operators in C - Class Notes</span>
                      <span className="text-[11px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">PDF • 12 pages</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      Covers operator precedence, bitwise logic, short-circuit evaluation, and past paper questions.
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
                      <span>Uploaded by Rahul Kumar</span>
                      <button
                        onClick={() => navigate('note-preview', { noteId: 'note-c-operators-1' })}
                        className="text-indigo-600 font-semibold hover:underline"
                      >
                        Read Note →
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-2 hover:border-indigo-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Operators Important Questions</span>
                      <span className="text-[11px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">PDF • 4 pages</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      Past 5 years solved university exam questions on C operator precedence and evaluation trees.
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
                      <span>Uploaded by Rahul Kumar</span>
                      <button
                        onClick={() => navigate('note-preview', { noteId: 'note-c-operators-2' })}
                        className="text-indigo-600 font-semibold hover:underline"
                      >
                        Read Note →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5 PRODUCT SECTIONS ================= */}
      {/* 1. Organize Your Semester */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                Hierarchical Architecture
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                1. Organize Your Semester
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Never lose a sheet or lecture slide again. NIU Notes mirrors your real university structure:
                <strong> Course → Semester → Subject → Lecture → Note</strong>. Access all semesters at any time, including past revisions.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-700"><strong>Semester-wise cards:</strong> Semester 1 through 8 remain fully visible and openable.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-700"><strong>Subject breakdown:</strong> Real syllabus subjects with active lecture and notes counters.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-700"><strong>Lecture granularity:</strong> Specific topics and handouts indexed under corresponding lectures.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">B.Tech CSE Semesters</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500">Semester 1</div>
                  <div className="text-base font-bold text-slate-900 mt-1">42 Notes</div>
                  <div className="text-xs text-slate-500 mt-0.5">5 Subjects</div>
                </div>
                <div className="p-4 bg-white rounded-xl border-2 border-indigo-500 shadow-xs bg-indigo-50/20">
                  <div className="text-xs font-bold text-indigo-600">Semester 2 (Current)</div>
                  <div className="text-base font-bold text-slate-900 mt-1">18 Notes</div>
                  <div className="text-xs text-slate-500 mt-0.5">5 Subjects</div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500">Semester 3</div>
                  <div className="text-base font-bold text-slate-900 mt-1">Upcoming</div>
                  <div className="text-xs text-slate-500 mt-0.5">6 Subjects</div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500">Semester 4</div>
                  <div className="text-base font-bold text-slate-900 mt-1">Upcoming</div>
                  <div className="text-xs text-slate-500 mt-0.5">6 Subjects</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Upload Your Own Notes */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm font-bold text-slate-900">Upload Note Dialog</span>
                <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Ready</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-700">Course & Subject:</span> B.Tech CSE • Programming in C
                </div>
                <div className="border-2 border-dashed border-indigo-200 rounded-xl p-6 text-center bg-indigo-50/20">
                  <UploadCloud className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-800">Drag & drop your PDF, DOCX or images</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Up to 25MB supported</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl border border-indigo-600 bg-indigo-50/50 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="font-semibold text-slate-900">Private Only</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-600">Public Discovery</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                Simple Content Creation
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                2. Upload Your Own Notes
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Digitize your handwritten pages, class lecture summaries, and previous exam solutions in seconds.
                Tag them by subject, unit, or lecture number so they are always in their rightful place.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-700"><strong>Private vs Public switch:</strong> Keep personal revision private or contribute publicly to help classmates.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-700"><strong>Multi-format support:</strong> PDF handouts, scans, typed DOCX, and slide decks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Explore Notes From Other Courses */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                Cross-Curricular Discovery
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                3. Explore Notes From Other Courses
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Studying for electives, competitive tests, or coding interviews? Discover verified notes across B.Tech, BCA, MCA, and specialized industry tracks for free.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-700"><strong>Preview before enrolling:</strong> Read public lecture notes without any friction.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-700"><strong>Free Course Enrollments:</strong> Add courses like C++, Python, and Web Development directly to your dashboard.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Featured Free Courses</div>
              <div className="space-y-2.5">
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">C++ Programming</h5>
                    <p className="text-[11px] text-slate-500">BCA & Elective • 124 Notes • 230 Students</p>
                  </div>
                  <button
                    onClick={() => navigate('course-details', { courseId: 'course-cpp' })}
                    className="px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg cursor-pointer"
                  >
                    Explore →
                  </button>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Python Programming</h5>
                    <p className="text-[11px] text-slate-500">Elective Track • 98 Notes • 310 Students</p>
                  </div>
                  <button
                    onClick={() => navigate('course-details', { courseId: 'course-python' })}
                    className="px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg cursor-pointer"
                  >
                    Explore →
                  </button>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Web Development Foundations</h5>
                    <p className="text-[11px] text-slate-500">Full Stack • 145 Notes • 420 Students</p>
                  </div>
                  <button
                    onClick={() => navigate('course-details', { courseId: 'course-webdev' })}
                    className="px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg cursor-pointer"
                  >
                    Explore →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Study Anywhere */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="h-64 rounded-xl bg-slate-100 p-4 font-mono text-xs text-slate-700 overflow-hidden flex flex-col justify-between border border-slate-200">
                <div>
                  <div className="font-bold text-indigo-700 text-sm"># Operators in C - Complete Lecture Summary</div>
                  <div className="text-slate-500 text-[11px] mt-1">Instructor: Prof. Sharma | Course: CS101</div>
                  <p className="mt-3 text-slate-600 text-xs leading-relaxed font-sans">
                    In C programming, operators are symbols that tell the compiler to perform specific mathematical or logical manipulations...
                  </p>
                </div>
                <div className="flex items-center justify-between text-slate-400 font-sans text-xs border-t border-slate-200 pt-2">
                  <span>Page 1 of 12</span>
                  <span className="text-indigo-600 font-semibold cursor-pointer">Download Offline PDF</span>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                Distraction-Free Reader
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                4. Study Anywhere
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Read notes comfortably on laptop, tablet, or phone with a clean Notion-like document reader. High-contrast typography, chapter bookmarks, and single-click downloads for offline exam prep.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-700"><strong>Bookmarking:</strong> Save notes with 1 click to read during exam week.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-700"><strong>Fast search:</strong> Locate formulas, definitions, and questions instantly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Simple Student Dashboard */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                Personalized Workspace
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                5. Simple Student Dashboard
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Start every morning with your personalized hub. See your notes count, enrolled electives, saved study material, and quickly jump back right where you left off.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-xl font-bold text-indigo-600">42</div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">My Notes</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-xl font-bold text-indigo-600">5</div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">Enrolled Courses</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-xl font-bold text-indigo-600">18</div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">Saved Notes</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-xl font-bold text-indigo-600">76</div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">Notes Read</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  RK
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Good morning, Rahul 👋</h4>
                  <p className="text-xs text-slate-500">B.Tech Computer Science Engineering • Semester 2</p>
                </div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="text-xs font-semibold text-slate-700">Quick Resume</div>
                <div className="text-xs text-indigo-600 font-medium">Programming in C / Lecture 3 - Operators</div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full w-3/4 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA SECTION ================= */}
      <section className="py-20 bg-indigo-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Start organizing your notes today.
          </h2>
          <p className="text-indigo-200 text-base max-w-xl mx-auto leading-relaxed">
            Join students from B.Tech, BCA, and MCA in building the cleanest academic notes repository.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('register')}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-indigo-950 bg-white hover:bg-slate-100 rounded-xl shadow-lg transition-colors cursor-pointer"
            >
              Create Free Account
            </button>
            <button
              onClick={() => navigate('explore')}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-white bg-indigo-800/80 hover:bg-indigo-800 border border-indigo-700 rounded-xl transition-colors cursor-pointer"
            >
              Browse Public Notes
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
