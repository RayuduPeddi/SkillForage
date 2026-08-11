export const APP_CONFIG = {
  appName: 'SkillForage',
  tagline: 'AI-Powered Adaptive Learning Platform',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  useMockApi: import.meta.env.VITE_ENABLE_MOCK_API !== 'false',
  defaultLearningGoal: 'Software Engineer Interview Prep',
  defaultDifficulty: 'Intermediate',
};
