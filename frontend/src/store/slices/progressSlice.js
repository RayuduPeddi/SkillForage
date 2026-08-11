import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { progressService } from '../../services/progressService';

export const fetchProgress = createAsyncThunk('progress/fetch', async (_, { rejectWithValue }) => {
  try {
    return await progressService.getStudentProgress();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const progressSlice = createSlice({
  name: 'progress',
  initialState: {
    progressData: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.progressData = action.payload;
      })
      .addCase(fetchProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default progressSlice.reducer;
