import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { learningService } from '../../services/learningService';

export const fetchLearningPath = createAsyncThunk('learning/fetchPath', async (_, { rejectWithValue }) => {
  try {
    return await learningService.getLearningPath();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchRecentActivity = createAsyncThunk('learning/fetchActivity', async (_, { rejectWithValue }) => {
  try {
    return await learningService.getRecentActivity();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const saveLessonNotes = createAsyncThunk('learning/saveNotes', async ({ lessonId, content }, { rejectWithValue }) => {
  try {
    await learningService.saveNotes(lessonId, content);
    return { lessonId, content };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const learningSlice = createSlice({
  name: 'learning',
  initialState: {
    learningPath: [],
    recentActivity: [],
    lessonNotes: {},
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLearningPath.fulfilled, (state, action) => {
        state.learningPath = action.payload;
      })
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.recentActivity = action.payload;
      })
      .addCase(saveLessonNotes.fulfilled, (state, action) => {
        state.lessonNotes[action.payload.lessonId] = action.payload.content;
      });
  },
});

export default learningSlice.reducer;
