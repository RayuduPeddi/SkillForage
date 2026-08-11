import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { quizService } from '../../services/quizService';

export const fetchQuizById = createAsyncThunk('quiz/fetchById', async (quizId, { rejectWithValue }) => {
  try {
    return await quizService.getQuizById(quizId);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const submitQuizAttempt = createAsyncThunk(
  'quiz/submit',
  async ({ quizId, answers, timeSpentSeconds }, { rejectWithValue }) => {
    try {
      return await quizService.submitQuiz(quizId, answers, timeSpentSeconds);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchTopicMastery = createAsyncThunk('quiz/fetchMastery', async (_, { rejectWithValue }) => {
  try {
    return await quizService.getTopicMastery();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const quizSlice = createSlice({
  name: 'quiz',
  initialState: {
    currentQuiz: null,
    lastResult: null,
    topicMastery: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  reducers: {
    clearQuizResult: (state) => {
      state.lastResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentQuiz = action.payload;
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(submitQuizAttempt.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(submitQuizAttempt.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.lastResult = action.payload;
      })
      .addCase(submitQuizAttempt.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })
      .addCase(fetchTopicMastery.fulfilled, (state, action) => {
        state.topicMastery = action.payload;
      });
  },
});

export const { clearQuizResult } = quizSlice.actions;
export default quizSlice.reducer;
