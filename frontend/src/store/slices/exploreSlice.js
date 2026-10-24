import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { noteApi } from '../../services/noteApi';
import { academicApi } from '../../services/academicApi';

/**
 * 1. Fetch Explore Data: Public notes, courses catalog, user's enrolled notes, and saved notes
 */
export const fetchExploreData = createAsyncThunk(
  'explore/fetchExploreData',
  async (_, { rejectWithValue }) => {
    try {
      const [notesRes, coursesRes, enrollmentsRes, savedRes] = await Promise.allSettled([
        noteApi.getPublicNotes({ all: 'true' }),
        academicApi.getAllCourses({ all: 'true' }),
        noteApi.getMyEnrolledNotes({ all: 'true' }),
        academicApi.getSavedNotes(),
      ]);

      const notes =
        notesRes.status === 'fulfilled' && notesRes.value?.success
          ? notesRes.value.data || []
          : [];

      const courses =
        coursesRes.status === 'fulfilled' && coursesRes.value?.success
          ? coursesRes.value.data || []
          : [];

      const enrollList =
        enrollmentsRes.status === 'fulfilled' && enrollmentsRes.value?.success
          ? enrollmentsRes.value.data || []
          : [];

      const enrolledNoteIds = enrollList
        .map((e) => (typeof e.note === 'object' && e.note?._id ? e.note._id : e.note))
        .filter(Boolean);

      const savedList =
        savedRes.status === 'fulfilled' && savedRes.value?.success
          ? savedRes.value.data || []
          : [];

      const savedNoteIds = savedList
        .map((s) => (typeof s.note === 'object' && s.note?._id ? s.note._id : s.note))
        .filter(Boolean);

      return {
        notes,
        courses,
        enrolledNoteIds,
        savedNoteIds,
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch explore notes');
    }
  }
);

/**
 * 2. Toggle Bookmark Thunk (Save / Remove bookmark)
 */
export const toggleBookmarkThunk = createAsyncThunk(
  'explore/toggleBookmark',
  async (noteId, { getState, rejectWithValue }) => {
    try {
      const isSaved = getState().explore.savedNoteIds.includes(noteId);
      if (isSaved) {
        await academicApi.removeSavedNote(noteId);
        return { noteId, action: 'removed' };
      } else {
        await academicApi.saveNote(noteId);
        return { noteId, action: 'saved' };
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Bookmark action failed');
    }
  }
);

/**
 * 3. Enroll in Note Thunk
 */
export const enrollNoteThunk = createAsyncThunk(
  'explore/enrollNote',
  async (noteId, { rejectWithValue }) => {
    try {
      const res = await noteApi.enrollInNote(noteId);
      if (res && res.success) {
        return { noteId, data: res.data };
      }
      return rejectWithValue(res?.message || 'Failed to enroll');
    } catch (err) {
      return rejectWithValue(err.message || 'Enrollment failed');
    }
  }
);

// Backward compatibility alias for any component still calling enrollCourseThunk
export const enrollCourseThunk = enrollNoteThunk;

const initialState = {
  notes: [],
  courses: [],
  enrolledNoteIds: [],
  savedNoteIds: [],
  loading: false,
  error: null,
  filters: {
    searchQuery: '',
    selectedCourseId: 'ALL',
    selectedSemesterNum: 'ALL',
    sortBy: 'newest', // 'newest' | 'views' | 'downloads'
  },
};

export const exploreSlice = createSlice({
  name: 'explore',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.filters.searchQuery = action.payload;
    },
    setSelectedCourseId: (state, action) => {
      state.filters.selectedCourseId = action.payload;
    },
    setSelectedSemesterNum: (state, action) => {
      state.filters.selectedSemesterNum = action.payload;
    },
    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload;
    },
    resetFilters: (state) => {
      state.filters.searchQuery = '';
      state.filters.selectedCourseId = 'ALL';
      state.filters.selectedSemesterNum = 'ALL';
      state.filters.sortBy = 'newest';
    },
    addEnrolledNoteId: (state, action) => {
      const id = action.payload;
      if (id && !state.enrolledNoteIds.includes(id)) {
        state.enrolledNoteIds.push(id);
      }
    },
    // Backward compatibility alias
    addEnrolledCourseId: (state, action) => {
      const id = action.payload;
      if (id && !state.enrolledNoteIds.includes(id)) {
        state.enrolledNoteIds.push(id);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch explore data
      .addCase(fetchExploreData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExploreData.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload.notes;
        state.courses = action.payload.courses;
        state.enrolledNoteIds = action.payload.enrolledNoteIds;
        state.savedNoteIds = action.payload.savedNoteIds;
      })
      .addCase(fetchExploreData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle bookmark
      .addCase(toggleBookmarkThunk.fulfilled, (state, action) => {
        const { noteId, action: act } = action.payload;
        if (act === 'saved') {
          if (!state.savedNoteIds.includes(noteId)) {
            state.savedNoteIds.push(noteId);
          }
        } else {
          state.savedNoteIds = state.savedNoteIds.filter((id) => id !== noteId);
        }
      })

      // Enroll in note
      .addCase(enrollNoteThunk.fulfilled, (state, action) => {
        const { noteId } = action.payload;
        if (noteId && !state.enrolledNoteIds.includes(noteId)) {
          state.enrolledNoteIds.push(noteId);
        }
      });
  },
});

export const {
  setSearchQuery,
  setSelectedCourseId,
  setSelectedSemesterNum,
  setSortBy,
  resetFilters,
  addEnrolledNoteId,
  addEnrolledCourseId,
} = exploreSlice.actions;

// Base Selectors
export const selectExploreNotes = (state) => state.explore.notes;
export const selectExploreCourses = (state) => state.explore.courses;
export const selectEnrolledNoteIds = (state) => state.explore.enrolledNoteIds;
export const selectEnrolledCourseIds = (state) => state.explore.enrolledNoteIds; // Clean alias
export const selectSavedNoteIds = (state) => state.explore.savedNoteIds;
export const selectExploreFilters = (state) => state.explore.filters;
export const selectExploreLoading = (state) => state.explore.loading;
export const selectExploreError = (state) => state.explore.error;

// Memoized Selector for Filtered and Sorted Notes
export const selectFilteredExploreNotes = createSelector(
  [selectExploreNotes, selectExploreFilters],
  (notes, filters) => {
    let result = [...notes];
    const { searchQuery, selectedCourseId, selectedSemesterNum, sortBy } = filters;

    const q = (searchQuery || '').trim().toLowerCase();
    if (q) {
      result = result.filter((n) => {
        const titleMatch = n.title?.toLowerCase().includes(q);
        const descMatch = n.description?.toLowerCase().includes(q);
        const tagsMatch = Array.isArray(n.tags)
          ? n.tags.some((t) => t.toLowerCase().includes(q))
          : typeof n.tags === 'string' && n.tags.toLowerCase().includes(q);

        const courseName = typeof n.course === 'object' ? n.course?.name : n.course;
        const subjectName = typeof n.subject === 'object' ? n.subject?.name : n.subject;
        const courseMatch = courseName?.toLowerCase().includes(q);
        const subjectMatch = subjectName?.toLowerCase().includes(q);

        return titleMatch || descMatch || tagsMatch || courseMatch || subjectMatch;
      });
    }

    if (selectedCourseId !== 'ALL') {
      result = result.filter((n) => {
        const cId = typeof n.course === 'object' ? n.course?._id : n.course;
        return cId === selectedCourseId;
      });
    }

    if (selectedSemesterNum !== 'ALL') {
      result = result.filter((n) => {
        const semNum =
          typeof n.semester === 'object' ? n.semester?.semesterNumber : Number(n.semester);
        return Number(semNum) === Number(selectedSemesterNum);
      });
    }

    if (sortBy === 'views') {
      result.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === 'downloads') {
      result.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    } else {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return result;
  }
);

export default exploreSlice.reducer;
