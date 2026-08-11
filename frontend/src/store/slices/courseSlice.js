import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { courseService } from '../../services/courseService';

export const fetchCourses = createAsyncThunk('courses/fetchCourses', async (filters, { rejectWithValue }) => {
  try {
    const data = await courseService.getCourses(filters);
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchCourseById = createAsyncThunk('courses/fetchCourseById', async (courseId, { rejectWithValue }) => {
  try {
    const data = await courseService.getCourseById(courseId);
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const enrollInCourse = createAsyncThunk('courses/enroll', async (courseId, { rejectWithValue }) => {
  try {
    const data = await courseService.enrollCourse(courseId);
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const markLessonComplete = createAsyncThunk('courses/markLessonComplete', async ({ courseId, lessonId }, { rejectWithValue }) => {
  try {
    const data = await courseService.updateLessonProgress(courseId, lessonId, true);
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    courses: [],
    currentCourse: null,
    enrolledCourses: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setCurrentCourse: (state, action) => {
      state.currentCourse = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = action.payload;
        state.enrolledCourses = action.payload.filter((c) => c.isEnrolled);
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.currentCourse = action.payload;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        state.currentCourse = action.payload;
        state.courses = state.courses.map((c) => (c.id === action.payload.id ? action.payload : c));
        state.enrolledCourses = state.courses.filter((c) => c.isEnrolled);
      })
      .addCase(markLessonComplete.fulfilled, (state, action) => {
        if (action.payload) {
          state.currentCourse = action.payload;
          state.courses = state.courses.map((c) => (c.id === action.payload.id ? action.payload : c));
        }
      });
  },
});

export const { setCurrentCourse } = courseSlice.actions;
export default courseSlice.reducer;
