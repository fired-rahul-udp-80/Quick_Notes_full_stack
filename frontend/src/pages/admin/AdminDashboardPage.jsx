import React from 'react';
 
import { ADMIN_STATS, RECENT_STUDENTS, ENROLLED_COURSES } from '../../data/mockData';
import {
  Users,
  BookOpen,
  FileText,
  BookmarkCheck,
  TrendingUp,
  ArrowUpRight,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  MoreVertical,
  Plus
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { notes, navigate, addToast } = useApp();

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Admin Overview & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            System overview of university departments, students, and uploaded study materials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Healthy
          </span>
        </div>
      </div>

      {/* 4 Primary Admin Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Students</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-3">
            {ADMIN_STATS.totalStudents.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12% this semester</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Courses</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-3">
            {ADMIN_STATS.totalCourses}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            4 academic faculties
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Notes</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-3">
            {ADMIN_STATS.totalNotes.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {ADMIN_STATS.publicNotes} public • {ADMIN_STATS.privateNotes} private
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Enrollments</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <BookmarkCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-3">
            {ADMIN_STATS.totalEnrollments}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24 this week</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Uploads & Popular Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Recent Uploads */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Note Uploads</h3>
              <p className="text-xs text-slate-500">Verified study documents uploaded by students</p>
            </div>
            <button
              onClick={() => navigate('admin-notes')}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Manage all notes →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-3 py-2.5">Title</th>
                  <th className="px-3 py-2.5">Course</th>
                  <th className="px-3 py-2.5">Subject</th>
                  <th className="px-3 py-2.5">Uploader</th>
                  <th className="px-3 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {notes.slice(0, 5).map((note) => (
                  <tr key={note.id} className="hover:bg-slate-50/70">
                    <td className="px-3 py-3 font-semibold text-slate-900 max-w-[180px] truncate">
                      {note.title}
                    </td>
                    <td className="px-3 py-3 text-slate-600">{note.course}</td>
                    <td className="px-3 py-3 text-slate-600 truncate max-w-[120px]">{note.subject}</td>
                    <td className="px-3 py-3 text-slate-500">{note.owner}</td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        note.visibility === 'PUBLIC'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {note.visibility}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (1 col): Popular Courses */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Popular Courses</h3>
            <span className="text-xs text-slate-400">By enrollments</span>
          </div>

          <div className="space-y-3">
            {ENROLLED_COURSES.map((course) => (
              <div
                key={course.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{course.title}</div>
                  <div className="text-[11px] text-slate-500">{course.program}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-indigo-600 block">{course.enrolledStudents}</span>
                  <span className="text-[10px] text-slate-400">Students</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Registered Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Students</h3>
            <p className="text-xs text-slate-500">Newly registered students across university degrees</p>
          </div>
          <button
            onClick={() => navigate('admin-users')}
            className="text-xs font-semibold text-indigo-600 hover:underline"
          >
            Manage users →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-4 py-2.5">Name</th>
                <th className="px-4 py-2.5">Email</th>
                <th className="px-4 py-2.5">Course</th>
                <th className="px-4 py-2.5">Semester</th>
                <th className="px-4 py-2.5">Joined</th>
                <th className="px-4 py-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {RECENT_STUDENTS.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-semibold text-slate-900">{st.name}</td>
                  <td className="px-4 py-3 text-slate-500">{st.email}</td>
                  <td className="px-4 py-3 text-slate-700 font-medium">{st.course}</td>
                  <td className="px-4 py-3 text-slate-600">{st.semester}</td>
                  <td className="px-4 py-3 text-slate-400">{st.joined}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      {st.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
