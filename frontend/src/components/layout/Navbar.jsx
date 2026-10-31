import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Logo } from '../common/Logo';
import { toggleTheme, selectThemeMode } from '../../store/slices/themeSlice';
import {
  ArrowRight,
  Menu,
  X,
  LayoutDashboard,
  Sun,
  Moon,
  Compass,
  BookOpen
} from 'lucide-react';

export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dashboardPath = role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard';

  const handleExploreClick = () => {
    if (isAuthenticated) {
      navigate('/student/explore');
    } else {
      navigate('/explore');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#07080b]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Logo onClick={() => navigate('/')} />

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            type="button"
            onClick={handleExploreClick}
            className="hover:text-primary dark:hover:text-yellow-300 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span>Explore Notes</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/course-details')}
            className="hover:text-primary dark:hover:text-yellow-300 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span>Courses</span>
          </button>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => navigate(dashboardPath)}
              className="flex items-center gap-1.5 text-primary dark:text-yellow-300 font-semibold hover:underline transition-colors cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="hover:text-primary dark:hover:text-yellow-300 transition-colors cursor-pointer"
            >
              Login
            </button>
          )}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={() => dispatch(toggleTheme())}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {themeMode === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => navigate(dashboardPath)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>Study Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger & Dark Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => dispatch(toggleTheme())}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <button
            type="button"
            onClick={() => {
              handleExploreClick();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 w-full text-left py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-yellow-300"
          >
            <Compass className="w-4 h-4 text-slate-400" />
            <span>Explore Notes</span>
          </button>
          <button
            type="button"
            onClick={() => {
              navigate('/course-details');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 w-full text-left py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-yellow-300"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>Courses</span>
          </button>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => {
                navigate(dashboardPath);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full text-left py-2 text-sm font-bold text-primary dark:text-yellow-300"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Study Dashboard</span>
            </button>
          ) : (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                type="button"
                onClick={() => {
                  navigate('/login');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate('/signup');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors cursor-pointer"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
