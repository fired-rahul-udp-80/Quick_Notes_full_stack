import React, { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Flame, Trophy, Calendar as CalendarIcon, Sparkles } from 'lucide-react';

export const StreakCalendar = ({ streak = {} }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const currentStreak = streak?.currentStreak ?? 1;
  const longestStreak = streak?.longestStreak ?? currentStreak;
  const activeDates = streak?.activeDates || [];

  // Set for fast O(1) date lookups
  const activeDatesSet = useMemo(() => {
    return new Set(activeDates);
  }, [activeDates]);

  // Helper to format Date to YYYY-MM-DD
  const formatDateToYMD = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isStreakDay = (date) => {
    return activeDatesSet.has(formatDateToYMD(date));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
      {/* ================= STREAK BANNER ================= */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center shadow-xs shrink-0">
            <Flame className="w-5 h-5 fill-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {currentStreak}
              </span>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                Day Streak!
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Active learning days logged
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 text-[11px] font-bold text-amber-800 dark:text-amber-300 rounded-lg">
          <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Best: {longestStreak}d</span>
        </div>
      </div>

      {/* ================= CALENDAR TITLE ================= */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Study Streak Calendar
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
          <span>Streak Day</span>
        </div>
      </div>

      {/* ================= REACT-CALENDAR WRAPPER ================= */}
      <div className="streak-calendar-wrapper">
        <style>{`
          .streak-calendar-wrapper .react-calendar {
            width: 100%;
            border: none;
            font-family: inherit;
            background: transparent;
          }
          .streak-calendar-wrapper .react-calendar__navigation {
            display: flex;
            height: 38px;
            margin-bottom: 0.5rem;
          }
          .streak-calendar-wrapper .react-calendar__navigation button {
            min-width: 32px;
            background: none;
            font-size: 13px;
            font-weight: 700;
            color: #1e293b;
            border-radius: 6px;
            transition: all 0.15s ease;
          }
          .dark .streak-calendar-wrapper .react-calendar__navigation button {
            color: #f1f5f9;
          }
          .streak-calendar-wrapper .react-calendar__navigation button:hover {
            background-color: #f1f5f9;
          }
          .dark .streak-calendar-wrapper .react-calendar__navigation button:hover {
            background-color: #334155;
          }
          .streak-calendar-wrapper .react-calendar__navigation button:disabled {
            opacity: 0.4;
          }
          .streak-calendar-wrapper .react-calendar__month-view__weekdays {
            font-size: 11px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            text-decoration: none;
            padding-bottom: 6px;
          }
          .dark .streak-calendar-wrapper .react-calendar__month-view__weekdays {
            color: #94a3b8;
          }
          .streak-calendar-wrapper .react-calendar__month-view__weekdays abbr {
            text-decoration: none;
          }
          .streak-calendar-wrapper .react-calendar__tile {
            padding: 8px 4px;
            font-size: 12px;
            font-weight: 600;
            color: #334155;
            transition: all 0.15s ease;
            position: relative;
            height: 40px;
            border-radius: 6px;
          }
          .dark .streak-calendar-wrapper .react-calendar__tile {
            color: #cbd5e1;
          }
          .streak-calendar-wrapper .react-calendar__tile:hover {
            background-color: #f8fafc;
          }
          .dark .streak-calendar-wrapper .react-calendar__tile:hover {
            background-color: #1e293b;
          }
          .streak-calendar-wrapper .react-calendar__tile--now {
            background: #eff6ff !important;
            color: #2563eb !important;
            font-weight: 800;
          }
          .dark .streak-calendar-wrapper .react-calendar__tile--now {
            background: #1e3a8a33 !important;
            color: #60a5fa !important;
          }
          .streak-calendar-wrapper .react-calendar__tile--active {
            background: var(--primary, #6366f1) !important;
            color: #ffffff !important;
          }
          .streak-calendar-wrapper .react-calendar__tile.streak-day-active {
            background: #fef3c7;
            color: #92400e;
            font-weight: 800;
          }
          .dark .streak-calendar-wrapper .react-calendar__tile.streak-day-active {
            background: #78350f44;
            color: #fde68a;
          }
          .streak-calendar-wrapper .react-calendar__tile.streak-day-active:hover {
            background: #fde68a;
          }
          .dark .streak-calendar-wrapper .react-calendar__tile.streak-day-active:hover {
            background: #78350f88;
          }
          .streak-calendar-wrapper .react-calendar__tile--active.streak-day-active {
            background: var(--primary, #6366f1) !important;
            color: #ffffff !important;
          }
        `}</style>

        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileClassName={({ date, view }) => {
            if (view === 'month' && isStreakDay(date)) {
              return 'streak-day-active';
            }
            return null;
          }}
          tileContent={({ date, view }) => {
            if (view === 'month' && isStreakDay(date)) {
              return (
                <div className="flex justify-center mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                </div>
              );
            }
            return null;
          }}
        />
      </div>

      {/* ================= FOOTER MOTIVATION ================= */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs rounded-xl">
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>
            {currentStreak > 0
              ? 'Awesome! You kept your streak active today.'
              : 'Study or upload a note today to start a streak!'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StreakCalendar;
