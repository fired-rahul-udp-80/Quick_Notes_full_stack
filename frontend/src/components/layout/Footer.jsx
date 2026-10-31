import React from 'react';
import { Logo } from '../common/Logo';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const Footer = () => {
  const navigate = useNavigate();
  const { role, isAuthenticated } = useSelector((state) => state.auth);
  const dashboardPath = role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard';

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 space-y-3">
            <Logo size="md" onClick={() => navigate('/')} />
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Store, organize and explore course-wise notes in one simple study platform designed for university students.
            </p>
            <div className="text-xs text-slate-400 dark:text-slate-500">
              © {new Date().getFullYear()} Quick NIU Notes. Built for higher education.
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">Platform</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => navigate(isAuthenticated ? dashboardPath : '/login')}
                  className="hover:text-primary dark:hover:text-yellow-300 transition-colors cursor-pointer"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate(isAuthenticated ? '/student/my-study' : '/login')}
                  className="hover:text-primary dark:hover:text-yellow-300 transition-colors cursor-pointer"
                >
                  My Study
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate(isAuthenticated ? '/student/my-notes' : '/login')}
                  className="hover:text-primary dark:hover:text-yellow-300 transition-colors cursor-pointer"
                >
                  My Notes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate(isAuthenticated ? '/student/saved-notes' : '/login')}
                  className="hover:text-primary dark:hover:text-yellow-300 transition-colors cursor-pointer"
                >
                  Saved Notes
                </button>
              </li>
            </ul>
          </div>

          {/* Explore Links */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">Explore</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/explore')}
                  className="hover:text-primary dark:hover:text-yellow-300 transition-colors cursor-pointer"
                >
                  Explore Notes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate(isAuthenticated ? '/student/enrolled-notes' : '/login')}
                  className="hover:text-primary dark:hover:text-yellow-300 transition-colors cursor-pointer"
                >
                  Enrolled Courses
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/course-details')}
                  className="hover:text-primary dark:hover:text-yellow-300 transition-colors cursor-pointer"
                >
                  Curriculum Courses
                </button>
              </li>
            </ul>
          </div>

          {/* Account & Legal */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">Account & Legal</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="hover:text-primary dark:hover:text-yellow-300 transition-colors cursor-pointer"
                >
                  Login
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="hover:text-primary dark:hover:text-yellow-300 transition-colors cursor-pointer"
                >
                  Register
                </button>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-500">Privacy Policy</span>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-500">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
