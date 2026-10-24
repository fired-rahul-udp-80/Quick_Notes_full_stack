import React, { useState } from 'react';
 
import { ACADEMIC_COURSES, ENROLLED_COURSES } from '../../data/mockData';
import { Plus, BookOpen, Layers, Users, Edit3, Trash2 } from 'lucide-react';

export const AdminCoursesPage = () => {
  const { addToast } = useApp();
  const [coursesList, setCoursesList] = useState(ENROLLED_COURSES);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Courses & Electives Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure academic degree programs and extracurricular learning tracks.
          </p>
        </div>

        <button
          onClick={() => addToast('New Course', 'Create course modal initiated')}
          className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {coursesList.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {course.program}
                </span>
                <span className="text-xs text-slate-400 font-medium">Rating: {course.rating} ★</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{course.title}</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{course.description}</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-600 font-medium">
                <span>{course.notesCount} Notes</span>
                <span>•</span>
                <span>{course.topicsCount} Topics</span>
                <span>•</span>
                <span>{course.enrolledStudents} Enrolled</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Instructor: {course.instructor}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => addToast('Edit Course', `Editing ${course.title}`)}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => addToast('Manage Syllabus', `Configuring curriculum for ${course.title}`)}
                  className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg"
                >
                  Curriculum
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
