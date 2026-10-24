import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { noteApi } from '../../services/noteApi';
import { academicApi } from '../../services/academicApi';

/**
 * Thunk: Fetch current student's enrolled notes and courses catalog
 * Aligned directly with backend NoteEnrollment (GET /api/notes/enrolled/my)
 */
export const fetchEnrolledData = createAsyncThunk(
  'enrolled/fetchEnrolledData',
  async (_, { rejectWithValue }) => {
    try {
      const [enrollRes, coursesRes] = await Promise.allSettled([
        noteApi.getMyEnrolledNotes({ all: 'true' }),
        academicApi.getAllCourses({ all: 'true' }),
      ]);

      const enrollments =
        enrollRes.status === 'fulfilled' && enrollRes.value?.success
          ? enrollRes.value.data || []
          : [];

      const courses =
        coursesRes.status === 'fulfilled' && coursesRes.value?.success
          ? coursesRes.value.data || []
          : [];

      return { enrollments, courses };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch enrolled note data');
    }
  }
);

/**
 * Thunk: Enroll in a note (POST /api/notes/:id/enroll)
 */
export const enrollNoteThunk = createAsyncThunk(
  'enrolled/enrollNote',
  async (noteId, { rejectWithValue }) => {
    try {
      const res = await noteApi.enrollInNote(noteId);
      if (res?.success) {
        return res.data;
      }
      return rejectWithValue(res?.message || 'Failed to enroll in note');
    } catch (err) {
      return rejectWithValue(err.message || 'Error enrolling in note');
    }
  }
);

/**
 * Thunk: Unenroll from a specific note (DELETE /api/notes/:id/enroll)
 */
export const unenrollNoteThunk = createAsyncThunk(
  'enrolled/unenrollNote',
  async (noteId, { rejectWithValue }) => {
    try {
      const res = await noteApi.unenrollFromNote(noteId);
      if (res?.success) {
        return noteId;
      }
      return rejectWithValue(res?.message || 'Failed to unenroll from note');
    } catch (err) {
      return rejectWithValue(err.message || 'Error unenrolling from note');
    }
  }
);

/**
 * Thunk: Unenroll from a course (unenrolls all notes under that course)
 */
export const unenrollCourseThunk = createAsyncThunk(
  'enrolled/unenrollCourse',
  async (courseId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const enrollments = state.enrolled?.enrollments || [];
      const courseEnrollments = enrollments.filter((item) => {
        const cId =
          typeof item.note === 'object' && item.note?.course
            ? item.note.course._id || item.note.course.id || item.note.course
            : null;
        return cId === courseId;
      });

      // Unenroll each note in this course via backend API
      await Promise.allSettled(
        courseEnrollments.map((item) => {
          const nId =
            typeof item.note === 'object' ? item.note._id || item.note.id : item.note;
          return noteApi.unenrollFromNote(nId);
        })
      );

      return courseId;
    } catch (err) {
      return rejectWithValue(err.message || 'Error unenrolling from course');
    }
  }
);

/**
 * Thunk: Update reading progress on an enrolled note (PATCH /api/notes/:id/progress)
 */
export const updateProgressThunk = createAsyncThunk(
  'enrolled/updateProgress',
  async ({ noteId, progress }, { rejectWithValue }) => {
    try {
      const res = await noteApi.updateNoteProgress(noteId, progress);
      if (res?.success) {
        return { noteId, data: res.data };
      }
      return rejectWithValue(res?.message || 'Failed to update progress');
    } catch (err) {
      return rejectWithValue(err.message || 'Error updating note progress');
    }
  }
);

const initialState = {
  enrollments: [], // Array of NoteEnrollment: { _id, student, note: {...}, status, progress, lastAccessedAt, enrolledAt }
  courses: [],     // Catalog courses for filtering
  loading: false,
  error: null,
  searchQuery: '',
  selectedCourseFilter: 'ALL',
  selectedSemesterFilter: 'ALL'
};

export const enrolledSlice = createSlice({
  name: 'enrolled',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCourseFilter: (state, action) => {
      state.selectedCourseFilter = action.payload;
    },
    setSelectedSemesterFilter: (state, action) => {
      state.selectedSemesterFilter = action.payload;
    },
    resetEnrolledFilters: (state) => {
      state.searchQuery = '';
      state.selectedCourseFilter = 'ALL';
      state.selectedSemesterFilter = 'ALL';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Enrolled Data
      .addCase(fetchEnrolledData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrolledData.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollments = action.payload.enrollments;
        state.courses = action.payload.courses;
      })
      .addCase(fetchEnrolledData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Enroll in Note
      .addCase(enrollNoteThunk.fulfilled, (state, action) => {
        const newEnrollment = action.payload;
        if (!newEnrollment) return;
        const noteId =
          typeof newEnrollment.note === 'object' && newEnrollment.note !== null
            ? newEnrollment.note._id || newEnrollment.note.id
            : newEnrollment.note;

        const existingIndex = state.enrollments.findIndex((item) => {
          const nId =
            typeof item.note === 'object' && item.note !== null
              ? item.note._id || item.note.id
              : item.note;
          return nId === noteId;
        });

        if (existingIndex >= 0) {
          state.enrollments[existingIndex] = newEnrollment;
        } else {
          state.enrollments.unshift(newEnrollment);
        }
      })

      // Unenroll from Note
      .addCase(unenrollNoteThunk.fulfilled, (state, action) => {
        const removedNoteId = action.payload;
        state.enrollments = state.enrollments.filter((item) => {
          const nId =
            typeof item.note === 'object' && item.note !== null
              ? item.note._id || item.note.id
              : item.note;
          return nId !== removedNoteId;
        });
      })

      // Unenroll from Course
      .addCase(unenrollCourseThunk.fulfilled, (state, action) => {
        const removedCourseId = action.payload;
        state.enrollments = state.enrollments.filter((item) => {
          const cId =
            typeof item.note === 'object' && item.note?.course
              ? item.note.course._id || item.note.course.id || item.note.course
              : null;
          return cId !== removedCourseId;
        });
        if (state.selectedCourseFilter === removedCourseId) {
          state.selectedCourseFilter = 'ALL';
        }
      })

      // Update Note Progress
      .addCase(updateProgressThunk.fulfilled, (state, action) => {
        const { noteId, data } = action.payload;
        const target = state.enrollments.find((item) => {
          const nId =
            typeof item.note === 'object' && item.note !== null
              ? item.note._id || item.note.id
              : item.note;
          return nId === noteId;
        });
        if (target && data) {
          target.progress = data.progress ?? target.progress;
          target.status = data.status || target.status;
          target.lastAccessedAt = data.lastAccessedAt || target.lastAccessedAt;
        }
      });
  },
});

export const {
  setSearchQuery,
  setSelectedCourseFilter,
  setSelectedSemesterFilter,
  resetEnrolledFilters,
} = enrolledSlice.actions;

// -------------------------------------------------------------
// Base Selectors
// -------------------------------------------------------------
export const selectEnrollments = (state) => state.enrolled?.enrollments || [];
export const selectEnrolledCoursesCatalog = (state) => state.enrolled?.courses || [];
export const selectEnrolledLoading = (state) => state.enrolled?.loading || false;
export const selectEnrolledError = (state) => state.enrolled?.error || null;
export const selectEnrolledSearchQuery = (state) => state.enrolled?.searchQuery || '';
export const selectSelectedCourseFilter = (state) => state.enrolled?.selectedCourseFilter || 'ALL';
export const selectSelectedSemesterFilter = (state) => state.enrolled?.selectedSemesterFilter || 'ALL';
export const selectEnrolledActiveView = (state) => state.enrolled?.activeView || 'notes';

// -------------------------------------------------------------
// Memoized Selectors (Optimized with createSelector)
// -------------------------------------------------------------

/**
 * Returns clean array of all active enrolled notes (flattened with enrollment progress & metadata)
 */
export const selectEnrolledNotes = createSelector(
  [selectEnrollments],
  (enrollments) => {
    return enrollments
      .filter((e) => e && (e.status === 'ACTIVE' || !e.status) && e.note)
      .map((e) => {
        if (typeof e.note === 'object' && e.note !== null) {
          return {
            ...e.note,
            enrollmentId: e._id,
            progress: e.progress ?? 0,
            enrollmentStatus: e.status || 'ACTIVE',
            enrolledAt: e.enrolledAt,
            lastAccessedAt: e.lastAccessedAt,
          };
        }
        return e.note;
      })
      .filter(Boolean);
  }
);

/**
 * Returns set/array of enrolled note IDs
 */
export const selectEnrolledNoteIds = createSelector(
  [selectEnrollments],
  (enrollments) => {
    return enrollments
      .filter((e) => e && (e.status === 'ACTIVE' || !e.status) && e.note)
      .map((e) => (typeof e.note === 'object' && e.note !== null ? e.note._id || e.note.id : e.note))
      .filter(Boolean);
  }
);

/**
 * Returns unique courses extracted from enrolled notes (or catalog)
 */
export const selectEnrolledCoursesList = createSelector(
  [selectEnrolledNotes, selectEnrolledCoursesCatalog],
  (notes, allCourses) => {
    const courseMap = new Map();

    notes.forEach((note) => {
      if (note.course && typeof note.course === 'object') {
        const cId = note.course._id || note.course.id;
        if (cId && !courseMap.has(cId)) {
          courseMap.set(cId, note.course);
        }
      } else if (note.course) {
        const cId = String(note.course);
        if (!courseMap.has(cId)) {
          const found = allCourses.find((c) => (c._id || c.id) === cId);
          if (found) {
            courseMap.set(cId, found);
          } else {
            courseMap.set(cId, { _id: cId, name: 'Curriculum Course' });
          }
        }
      }
    });

    return Array.from(courseMap.values());
  }
);

/**
 * Returns filtered enrolled notes based on user search query, course filter, and semester filter
 */
export const selectFilteredEnrolledNotes = createSelector(
  [
    selectEnrolledNotes,
    selectEnrolledSearchQuery,
    selectSelectedCourseFilter,
    selectSelectedSemesterFilter,
  ],
  (notes, searchQuery, courseFilter, semesterFilter) => {
    let result = [...notes];
    const q = (searchQuery || '').trim().toLowerCase();

    if (q) {
      result = result.filter((n) => {
        const titleMatch = n.title?.toLowerCase().includes(q);
        const descMatch = n.description?.toLowerCase().includes(q);
        const courseName = typeof n.course === 'object' ? n.course?.name : n.course;
        const subjectName = typeof n.subject === 'object' ? n.subject?.name : n.subject;
        const ownerName = typeof n.owner === 'object' ? n.owner?.name : n.owner;

        const courseMatch = courseName?.toLowerCase().includes(q);
        const subjectMatch = subjectName?.toLowerCase().includes(q);
        const authorMatch = ownerName?.toLowerCase().includes(q);

        return titleMatch || descMatch || courseMatch || subjectMatch || authorMatch;
      });
    }

    if (courseFilter !== 'ALL') {
      result = result.filter((n) => {
        const cId = typeof n.course === 'object' ? n.course?._id || n.course?.id : n.course;
        return cId === courseFilter;
      });
    }

    if (semesterFilter !== 'ALL') {
      result = result.filter((n) => {
        const sem =
          typeof n.semester === 'object' ? n.semester?.semesterNumber : Number(n.semester);
        return Number(sem) === Number(semesterFilter);
      });
    }

    return result;
  }
);

/**
 * Aggregate summary statistics for the Enrolled Dashboard
 */
export const selectEnrolledStats = createSelector(
  [selectEnrolledNotes, selectEnrolledCoursesList],
  (notes, courses) => {
    const subjectsSet = new Set(
      notes
        .map((n) => (typeof n.subject === 'object' ? n.subject?._id || n.subject?.name : n.subject))
        .filter(Boolean)
    );

    return {
      totalCourses: courses.length,
      totalNotes: notes.length,
      totalSubjects: subjectsSet.size,
    };
  }
);

export default enrolledSlice.reducer;
