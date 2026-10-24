import React from 'react';
import { Logo } from '../common/Logo';
 
import {
  BarChart3,
  Users,
  BookOpen,
  Calendar,
  Layers,
  FileText,
  FileCheck2,
  Settings,
  ArrowLeft,
  Search,
  Bell,
  ShieldAlert
} from 'lucide-react';

export const AdminLayout = ({ children }) => {
  const { currentView, navigate, switchRole, user } = useApp();

  const adminNavItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'admin-users', label: 'Users', icon: Users },
    { id: 'admin-courses', label: 'Courses', icon: BookOpen },
    { id: 'admin-semesters', label: 'Semesters', icon: Calendar },
    { id: 'admin-subjects', label: 'Subjects', icon: Layers },
    { id: 'admin-notes', label: 'Notes', icon: FileText },
    { id: 'admin-reports', label: 'Reports', icon: FileCheck2 },
    { id: 'admin-settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col md:flex-row antialiased">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white shrink-0 flex flex-col justify-between">
        <div>
          {/* Brand & Admin Badge */}
          <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold text-sm">
                N
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-white">NIU Admin</span>
                <span className="block text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Portal V1</span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Return to Student Dashboard CTA */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => switchRole('STUDENT')}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Student App</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-md">
              ADMINISTRATOR
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Academic Curriculum & Notes Management
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-600 font-medium">{user.email}</span>
            <button
              onClick={() => switchRole('STUDENT')}
              className="text-xs text-indigo-600 font-semibold hover:underline"
            >
              Exit Admin
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
