import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { recommendationService } from '../../services/recommendationService';

export const fetchRecommendations = createAsyncThunk('recommendations/fetch', async (_, { rejectWithValue }) => {
  try {
    return await recommendationService.getRecommendations();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchPracticeProblems = createAsyncThunk('recommendations/fetchPractice', async (filters, { rejectWithValue }) => {
  try {
    return await recommendationService.getPracticeProblems(filters?.topic, filters?.difficulty);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const recommendationSlice = createSlice({
  name: 'recommendations',
  initialState: {
    recommendations: [],
    practiceProblems: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.recommendations = action.payload;
      })
      .addCase(fetchPracticeProblems.fulfilled, (state, action) => {
        state.practiceProblems = action.payload;
      });
  },
});

export default recommendationSlice.reducer;
