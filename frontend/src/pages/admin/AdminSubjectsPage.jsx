import React, { useState } from 'react';
 
import { SUBJECTS_BY_SEMESTER } from '../../data/mockData';
import { Plus, Layers, BookOpen, Trash2 } from 'lucide-react';

export const AdminSubjectsPage = () => {
  const { addToast } = useApp();
  const [selectedSem, setSelectedSem] = useState(1);

  const subjects = SUBJECTS_BY_SEMESTER[selectedSem] || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Subjects & Syllabus Mapping
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage semester curriculum subjects, lectures structure, and syllabus units.
          </p>
        </div>

        <button
          onClick={() => addToast('Add Subject', 'New subject creation form opened')}
          className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Semester Selector */}
      <div className="flex items-center gap-2 overflow-x-auto bg-white p-2.5 rounded-2xl border border-slate-200">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
          <button
            key={s}
            onClick={() => setSelectedSem(s)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
              selectedSem === s
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Semester {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-sm text-slate-900">
          Subjects in Semester {selectedSem} ({subjects.length})
        </div>

        <div className="divide-y divide-slate-100">
          {subjects.map((sub) => (
            <div key={sub.id} className="p-4.5 flex items-center justify-between hover:bg-slate-50/70 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center">
                  {sub.code}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{sub.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{sub.lecturesCount} Lectures • {sub.notesCount} Active Notes</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => addToast('Configure Lectures', `Editing lectures for ${sub.name}`)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Manage Lectures
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
