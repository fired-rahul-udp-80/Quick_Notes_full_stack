import React from 'react';
import { Logo } from '../common/Logo';
import {useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const Footer = () => {
  const navigate = useNavigate();
  const {role} = useSelector((state) => state.auth);

  return (
    <footer className="bg-white border-t border-slate-200/90 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 space-y-3">
            <Logo size="md" onClick={() => navigate('landing')} />
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Store, organize and explore course-wise notes in one simple study platform designed for university students.
            </p>
            <div className="text-xs text-slate-400">
              © {new Date().getFullYear()} NIU Notes. Built for higher education.
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">Platform</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('dashboard')} className="hover:text-indigo-600 transition-colors">
                  Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => navigate('my-study')} className="hover:text-indigo-600 transition-colors">
                  My Study
                </button>
              </li>
              <li>
                <button onClick={() => navigate('my-notes')} className="hover:text-indigo-600 transition-colors">
                  My Notes
                </button>
              </li>
              <li>
                <button onClick={() => navigate('saved-notes')} className="hover:text-indigo-600 transition-colors">
                  Saved Notes
                </button>
              </li>
            </ul>
          </div>

          {/* Explore Links */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">Explore</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('explore')} className="hover:text-indigo-600 transition-colors">
                  Explore Notes
                </button>
              </li>
              <li>
                <button onClick={() => navigate('enrolled-courses')} className="hover:text-indigo-600 transition-colors">
                  Enrolled Courses
                </button>
              </li>
              <li>
                <button onClick={() => navigate('course-details', { courseId: 'course-cpp' })} className="hover:text-indigo-600 transition-colors">
                  C++ Programming
                </button>
              </li>
              <li>
                <button onClick={() => navigate('course-details', { courseId: 'course-python' })} className="hover:text-indigo-600 transition-colors">
                  Python Notes
                </button>
              </li>
            </ul>
          </div>

          {/* Account & Legal */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">Account & Legal</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('login')} className="hover:text-indigo-600 transition-colors">
                  Login
                </button>
              </li>
              <li>
                <button onClick={() => navigate('register')} className="hover:text-indigo-600 transition-colors">
                  Register
                </button>
              </li>
              <li>
                <span className="text-slate-400">Privacy Policy</span>
              </li>
              <li>
                <span className="text-slate-400">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
