import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Bell,
  BookOpen,
  Calendar,
  Flame,
  Mail,
  Save
} from 'lucide-react';

export const NotificationSettings = () => {
  const [prefs, setPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem('study_notification_preferences');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return {
      noteUploads: true,
      syllabusUpdates: true,
      studyStreak: true,
      emailDigest: false
    };
  });

  const togglePref = (key) => {
    setPrefs((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(
          'study_notification_preferences',
          JSON.stringify(updated)
        );
      } catch (e) {
        console.error(e);
      }
      toast.success('Preference updated');
      return updated;
    });
  };

  const handleSaveAll = () => {
    try {
      localStorage.setItem(
        'study_notification_preferences',
        JSON.stringify(prefs)
      );
      toast.success('Notification preferences saved successfully!');
    } catch (e) {
      toast.error('Failed to save preferences');
    }
  };

  const notificationItems = [
    {
      id: 'noteUploads',
      title: 'New Note Upload Alerts',
      description: 'Receive notifications when new notes are added to your enrolled courses and semester subjects.',
      icon: BookOpen,
      checked: prefs.noteUploads
    },
    {
      id: 'syllabusUpdates',
      title: 'Semester Curriculum & Syllabus Updates',
      description: 'Get notified when new subject modules or semester exam topics are refreshed by professors.',
      icon: Calendar,
      checked: prefs.syllabusUpdates
    },
    {
      id: 'studyStreak',
      title: 'Study Streak & Activity Reminders',
      description: 'Daily gentle reminder to read your notes and maintain your active study streak.',
      icon: Flame,
      checked: prefs.studyStreak
    },
    {
      id: 'emailDigest',
      title: 'Weekly Academic Email Digest',
      description: 'Receive a concise weekly summary of newly available study materials in your registered inbox.',
      icon: Mail,
      checked: prefs.emailDigest
    }
  ];

  return (
    <div className="bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header Bar */}
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Bell className="w-4 h-4 text-[var(--primary)]" />
          <span>Notification & Communication Preferences</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Select what study activity alerts and semester reminders you would like to receive.
        </p>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-slate-100">
        {notificationItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-none bg-slate-100 text-[var(--primary)] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                    {item.title}
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Custom Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => togglePref(item.id)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none peer-checked:bg-[var(--primary)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all" />
              </label>
            </div>
          );
        })}
      </div>

      {/* Bottom Save confirmation */}
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="button"
          onClick={handleSaveAll}
          className="px-5 py-2 text-xs font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Preferences</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;
