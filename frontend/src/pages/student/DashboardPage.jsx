import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { NoteCard } from '../../components/common/NoteCard';
import { DashboardStats } from '../../components/student/dashboard/DashboardStats';
import { StreakCalendar } from '../../components/student/dashboard/StreakCalendar';
import { dashboardApi } from '../../services/dashboardApi';
import { CURRENT_STUDENT } from '../../data/mockData';
import { FileText, Plus, ArrowRight, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const DashboardPage = () => {
  const navigate = useNavigate();

  const { user: authUser } = useSelector((state) => state.auth);
  const user = authUser || CURRENT_STUDENT;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      myNotesCount: 0,
      enrolledCoursesCount: 0,
      savedNotesCount: 0,
      notesReadCount: 0,
    },
    streak: {
      currentStreak: 1,
      longestStreak: 1,
      activeDates: [],
    },
    recentNotes: [],
  });

  const fetchDashboard = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      const res = await dashboardApi.getStudentStats();
      if (res && res.success && res.data) {
        setDashboardData(res.data);
        if (isManual) toast.success('Dashboard refreshed');
      }
    } catch (err) {
      console.error('Failed to fetch dashboard statistics:', err);
      if (isManual) toast.error('Failed to refresh dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard(false);

    const handleAppRefresh = () => fetchDashboard(true);
    window.addEventListener('app:refresh', handleAppRefresh);
    return () => window.removeEventListener('app:refresh', handleAppRefresh);
  }, []);

  const handleRefresh = () => {
    fetchDashboard(true);
  };

  const recentNotes = dashboardData.recentNotes || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header bar with Refresh Button */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'Student'}!
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track your study stats, recent notes, and daily progress.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[var(--primary)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
          title="Refresh dashboard stats"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[var(--primary)]' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 1. Connected Backend Stats Cards */}
      <DashboardStats stats={dashboardData.stats} loading={loading} />
      <div className='grid grid-cols-12 gap-4'>
        {/* 2. Recent Notes Section */}
          <div className="space-y-4 col-span-12 xl:col-span-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Recent Notes</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pick up where you left off reading or revising.
                </p>
              </div>
              <button
                onClick={() => navigate('/student/my-notes')}
                className="text-xs font-semibold text-primary dark:text-yellow-300 hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>View all notes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentNotes.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center space-y-3">
                <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No notes available yet</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Upload your first study note to start tracking your revision notes.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/student/add-notes')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload Note</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentNotes.map((note) => (
                  <NoteCard
                    key={note._id || note.id}
                    note={{
                      ...note,
                      id: note._id || note.id,
                      course: note.course?.courseCode || note.course?.name || 'General',
                      subject: note.subject?.name || 'Subject',
                      owner: note.owner?.name || user?.name || 'Student',
                      uploadedAt: note.createdAt,
                    }}
                     
                  />
                ))}
              </div>
            )}
          </div>
        {/* Right Column (4 cols on 2nd right side): Daily Streak Calendar */}
        <div className="col-span-12 xl:col-span-4">
          <StreakCalendar streak={dashboardData.streak} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
