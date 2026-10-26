import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { authApi } from '../../../services/authApi';
import { setCredentials } from '../../../store/slices/authSlice';
import {
  User,
  Mail,
  GraduationCap,
  Save,
  RotateCcw,
  Loader2,
  ShieldAlert
} from 'lucide-react';

export const ProfileSettings = ({ user }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState(user?.name || '');
  const [course, setCourse] = useState(
    user?.academicProfile?.courseName || ''
  );
  const [semester, setSemester] = useState(
    user?.academicProfile?.currentSemester || 1
  );
  const [isSaving, setIsSaving] = useState(false);

  // Sync internal state when user prop changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setCourse(user.academicProfile?.courseName || '');
      setSemester(user.academicProfile?.currentSemester || 1);
    }
  }, [user]);

  const handleReset = () => {
    if (user) {
      setName(user.name || '');
      setCourse(user.academicProfile?.courseName || '');
      setSemester(user.academicProfile?.currentSemester || 1);
      toast('Reset form to current profile details');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Full name is required');
      return;
    }

    try {
      setIsSaving(true);
      const res = await authApi.updateProfile({
        name: name.trim(),
        academicCourse: course.trim(),
        currentSemester: Number(semester)
      });

      if (res && res.success && res.data?.user) {
        dispatch(setCredentials(res.data.user));
        toast.success(res.message || 'Academic profile updated successfully!');
      } else {
        throw new Error(res?.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error(err.message || 'Could not update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const isDirty =
    name !== (user?.name || '') ||
    course !== (user?.academicProfile?.courseName || '') ||
    Number(semester) !== (user?.academicProfile?.currentSemester || 1);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs transition-colors">
      {/* Section Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <User className="w-4 h-4 text-[var(--primary)] dark:text-indigo-400" />
          <span>Academic Profile Information</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Update your student identity details and current semester curriculum track.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors"
              />
            </div>
          </div>

          {/* Email Address (Read-only) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed select-none"
              />
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">
              Email is permanently bound to your academic record and cannot be changed here.
            </p>
          </div>

          {/* Academic Course */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Academic Course
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. B.Tech Computer Science & Engineering"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors"
              />
            </div>
          </div>

          {/* Current Semester Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Current Semester
            </label>
            <div className="relative">
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-colors cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num} className="dark:bg-slate-800 dark:text-slate-100">
                    Semester {num}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div>
            {isDirty && (
              <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold inline-flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                Unsaved changes
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={!isDirty || isSaving}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="submit"
              disabled={isSaving || !isDirty}
              className="px-5 py-2 text-xs font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-40 transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
