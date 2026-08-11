import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import courseReducer from './slices/courseSlice';
import learningReducer from './slices/learningSlice';
import quizReducer from './slices/quizSlice';
import progressReducer from './slices/progressSlice';
import recommendationReducer from './slices/recommendationSlice';
import aiMentorReducer from './slices/aiMentorSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    learning: learningReducer,
    quiz: quizReducer,
    progress: progressReducer,
    recommendations: recommendationReducer,
    aiMentor: aiMentorReducer,
    ui: uiReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});
