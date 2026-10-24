import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { useSelector } from 'react-redux';
import { ArrowRight, Menu, X, LayoutDashboard, Shield } from 'lucide-react';

export const Navbar = () => {
  const {isAuthenticated,user,role} = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Logo onClick={() => navigate('landing')} />

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => navigate('explore')}
            className="hover:text-indigo-600 transition-colors cursor-pointer"
          >
            Explore Notes
          </button>
          <button
            onClick={() => navigate('course-details', { courseId: 'course-cpp' })}
            className="hover:text-indigo-600 transition-colors cursor-pointer"
          >
            Courses
          </button>
          
          {isAuthenticated ? (
            <button
              onClick={() => navigate('dashboard')}
              className="flex items-center gap-1.5 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('login')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Login
            </button>
          )}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => switchRole(role === 'STUDENT' ? 'ADMIN' : 'STUDENT')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                title="Switch between Student and Admin preview"
              >
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                <span>{role === 'STUDENT' ? 'Admin Mode' : 'Student Mode'}</span>
              </button>
              <button
                onClick={() => navigate('dashboard')}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <span>Study Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('register')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-700" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <button
            onClick={() => {
              navigate('explore');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-semibold text-slate-700"
          >
            Explore Notes
          </button>
          <button
            onClick={() => {
              navigate('course-details', { courseId: 'course-cpp' });
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-semibold text-slate-700"
          >
            Courses
          </button>
          {isAuthenticated ? (
            <button
              onClick={() => {
                navigate('dashboard');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm font-semibold text-indigo-600"
            >
              Study Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate('login');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm font-semibold text-slate-700"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate('register');
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-2 py-2.5 text-center text-sm font-semibold text-white bg-indigo-600 rounded-xl shadow-xs"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
