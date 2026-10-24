import React, { useState } from 'react';
 
import { RECENT_STUDENTS } from '../../data/mockData';
import { Search, UserPlus, Filter, MoreVertical, Check, X, Shield } from 'lucide-react';

export const AdminUsersPage = () => {
  const { addToast } = useApp();
  const [users, setUsers] = useState(RECENT_STUDENTS);
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.course.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u
      )
    );
    addToast('Status Updated', 'Student status modified.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Student User Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            View, filter, and manage registered student accounts across courses.
          </p>
        </div>

        <button
          onClick={() => addToast('Add Student', 'Admin invite modal opened')}
          className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Student</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, course..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">{filteredUsers.length} total users</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">University Email</th>
                <th className="px-4 py-3">Academic Course</th>
                <th className="px-4 py-3">Current Semester</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3.5 font-bold text-slate-900">{st.name}</td>
                  <td className="px-4 py-3.5 text-slate-500">{st.email}</td>
                  <td className="px-4 py-3.5 font-medium text-slate-700">{st.course}</td>
                  <td className="px-4 py-3.5 text-slate-600">{st.semester}</td>
                  <td className="px-4 py-3.5 text-slate-400">{st.joined}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      st.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}>
                      {st.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => toggleStatus(st.id)}
                      className="text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      {st.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
