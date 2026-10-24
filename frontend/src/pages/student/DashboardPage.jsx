import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { NoteCard } from '../../components/common/NoteCard';
import { DashboardStats } from '../../components/student/dashboard/DashboardStats';
import { StreakCalendar } from '../../components/student/dashboard/StreakCalendar';
import { dashboardApi } from '../../services/dashboardApi';
import { CURRENT_STUDENT } from '../../data/mockData';
import { FileText, Plus, ArrowRight } from 'lucide-react';

export const DashboardPage = () => {
  const navigate = useNavigate();

  const { user: authUser } = useSelector((state) => state.auth);
  const user = authUser || CURRENT_STUDENT;

  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await dashboardApi.getStudentStats();
        if (isMounted && res && res.success && res.data) {
          console.log("dashboard data", res.data);
          setDashboardData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard statistics:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const recentNotes = dashboardData.recentNotes || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Connected Backend Stats Cards */}
      <DashboardStats stats={dashboardData.stats} loading={loading} />
      <div className='grid grid-cols-12 gap-4'>
        {/* 2. Recent Notes Section */}
          <div className="space-y-4 col-span-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Notes</h3>
                <p className="text-xs text-slate-500">
                  Pick up where you left off reading or revising.
                </p>
              </div>
              <button
                onClick={() => navigate('/student/my-notes')}
                className="text-xs font-semibold text-[var(--primary)] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>View all notes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentNotes.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-200 p-8 text-center space-y-3">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800">No notes available yet</p>
                  <p className="text-xs text-slate-500">
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
        <div className="xl:col-span-4 ">
          <StreakCalendar streak={dashboardData.streak} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
