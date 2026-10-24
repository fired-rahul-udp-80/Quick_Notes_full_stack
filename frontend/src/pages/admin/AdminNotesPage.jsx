import React, { useState } from 'react';
 
import { Search, FileText, Trash2, Globe, Lock, ExternalLink } from 'lucide-react';

export const AdminNotesPage = () => {
  const { notes, deleteNote, navigate, addToast } = useApp();
  const [search, setSearch] = useState('');

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.subject.toLowerCase().includes(search.toLowerCase()) ||
      n.owner.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            All Repository Notes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse and monitor university notes uploaded by students across all semesters.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, subject, student..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">{filtered.length} total notes</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Course / Sem</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Visibility</th>
                <th className="px-4 py-3">Views</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((n) => (
                <tr key={n.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3.5 font-bold text-slate-900 max-w-[200px] truncate">
                    {n.title}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{n.course} • Sem {n.semester}</td>
                  <td className="px-4 py-3.5 text-slate-700 font-medium">{n.subject}</td>
                  <td className="px-4 py-3.5 text-slate-500">{n.owner}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      n.visibility === 'PUBLIC'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {n.visibility === 'PUBLIC' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      {n.visibility}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">{n.views || 0}</td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate('note-preview', { noteId: n.id })}
                        className="text-indigo-600 hover:underline font-semibold"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => deleteNote(n.id)}
                        className="text-rose-600 hover:bg-rose-50 p-1 rounded"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
