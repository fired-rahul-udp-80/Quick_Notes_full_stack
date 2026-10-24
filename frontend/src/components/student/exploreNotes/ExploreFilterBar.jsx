import React from 'react';
import { Search, RotateCcw, BookOpen, Layers } from 'lucide-react';

export const ExploreFilterBar = ({
  searchQuery = '',
  onSearchChange,
  courses = [],
  selectedCourseId = 'ALL',
  onCourseChange,
  selectedSemesterNum = 'ALL',
  onSemesterChange,
  sortBy = 'newest',
  onSortChange,
  onResetFilters,
  totalNotes = 0,
}) => {
  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedCourseId !== 'ALL' ||
    selectedSemesterNum !== 'ALL' ||
    sortBy !== 'newest';

  return (
    <div className="flex-1 max-w-5xl flex items-center gap-2 min-w-0">
      {/* Integrated Search & Course Selector Bar */}
      <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 hover:border-slate-300 focus-within:border-[var(--primary)] focus-within:bg-white focus-within:ring-2 focus-within:ring-[var(--primary)]/15 transition-all min-w-0">
        {/* Search Icon & Input */}
        <div className="flex items-center flex-1 min-w-[120px] px-2.5 py-1">
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search notes, topics, tags..."
            className="w-full text-xs sm:text-sm bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-slate-200 shrink-0" />

        {/* Course Filter Dropdown */}
        <div className="flex items-center shrink-0 pr-1 pl-2">
          <BookOpen className="w-3 h-3 text-slate-400 mr-1 hidden sm:inline shrink-0" />
          <select
            value={selectedCourseId}
            onChange={(e) => onCourseChange && onCourseChange(e.target.value)}
            className="text-xs font-semibold bg-transparent text-slate-700 py-1.5 pr-2 outline-none cursor-pointer max-w-[110px] sm:max-w-[150px] truncate"
            title="Filter by Course"
          >
            <option value="ALL">All Courses</option>
            {courses.map((c) => (
              <option key={c._id || c.id} value={c._id || c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Semester Dropdown (visible sm and up) */}
      <div className="hidden sm:flex items-center shrink-0">
        <select
          value={selectedSemesterNum}
          onChange={(e) => onSemesterChange && onSemesterChange(e.target.value)}
          className="text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-2 py-1.5 outline-none cursor-pointer transition-colors"
          title="Filter by Semester"
        >
          <option value="ALL">All Semesters</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <option key={num} value={num}>
              Sem {num}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Select (visible md and up) */}
      <div className="hidden md:flex items-center shrink-0">
        <select
          value={sortBy}
          onChange={(e) => onSortChange && onSortChange(e.target.value)}
          className="text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-2 py-1.5 outline-none cursor-pointer transition-colors"
          title="Sort Notes"
        >
          <option value="newest">Newest</option>
          <option value="views">Most Viewed</option>
          <option value="downloads">Downloads</option>
        </select>
      </div>

      {/* Reset Button (shows only when filters are active) */}
      {hasActiveFilters && onResetFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          title="Reset filters"
          className="p-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Notes Count Badge (visible lg and up) */}
      {totalNotes > 0 && (
        <span className="hidden lg:inline-flex text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-1 shrink-0">
          {totalNotes} notes
        </span>
      )}
    </div>
  );
};

export default ExploreFilterBar;
