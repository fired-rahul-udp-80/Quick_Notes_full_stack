import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardApi } from '../../services/dashboardApi';

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await dashboardApi.getStudentStats();
      if (res && res.success && res.data) {
        return res.data;
      }
      return rejectWithValue(res?.message || 'Failed to fetch dashboard statistics');
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch dashboard statistics'
      );
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  stats: {
    myNotesCount: 0,
    enrolledCoursesCount: 0,
    savedNotesCount: 0,
    notesReadCount: 0,
  },
  streak: {
    currentStreak: 1,
    longestStreak: 1,
    activeDates: [],
  },
  recentNotes: [],
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats || state.stats;
        state.streak = action.payload.streak || state.streak;
        state.recentNotes = action.payload.recentNotes || [];
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
