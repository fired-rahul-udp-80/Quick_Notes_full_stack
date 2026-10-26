import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Breadcrumb } from '../../../components/common/Breadcrumb';
import { AccountOverviewCard } from '../../../components/student/settings/AccountOverviewCard';
import { ProfileSettings } from '../../../components/student/settings/ProfileSettings';
import { SecuritySettings } from '../../../components/student/settings/SecuritySettings';
import { NotificationSettings } from '../../../components/student/settings/NotificationSettings';
import { User, KeyRound, Bell } from 'lucide-react';

export const SettingsPage = () => {
  const { user } = useSelector((state) => state.auth || {});
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    {
      id: 'profile',
      label: 'Academic Profile',
      icon: User
    },
    {
      id: 'security',
      label: 'Security & Password',
      icon: KeyRound
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb */}
      <Breadcrumb items={[{ label: 'Settings' }]} />

      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Account & Academic Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your personal student profile, credentials, and notification preferences.
        </p>
      </div>

      {/* 1. Account Summary Banner Card */}
      <AccountOverviewCard user={user} />

      {/* 2. Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-6 text-xs sm:text-sm font-bold select-none overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 transition-colors cursor-pointer border-b-2 -mb-[2px] inline-flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'border-[var(--primary)] text-[var(--primary-dark)] dark:text-indigo-400 dark:border-indigo-500'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--primary)] dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Body Views */}
      <div className="mt-4">
        {activeTab === 'profile' && <ProfileSettings user={user} />}
        {activeTab === 'security' && <SecuritySettings user={user} />}
        {activeTab === 'notifications' && <NotificationSettings />}
      </div>
    </div>
  );
};

export default SettingsPage;
