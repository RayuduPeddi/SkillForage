export const ROUTES = {
  // Auth
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ONBOARDING: '/onboarding',

  // Student
  DASHBOARD: '/dashboard',
  MY_LEARNING: '/my-learning',
  COURSES: '/courses',
  COURSE_DETAILS: '/courses/:courseId',
  COURSE_LEARN: '/learn/:courseId/:lessonId',
  QUIZ: '/quiz/:quizId',
  QUIZ_RESULTS: '/quiz/:quizId/results',
  LEARNING_ANALYSIS: '/learning-analysis',
  LEARNING_PATH: '/learning-path',
  PRACTICE: '/practice',
  AI_MENTOR: '/ai-mentor',
  PROGRESS: '/progress',
  STUDENT_PROFILE: '/profile',
  STUDENT_SETTINGS: '/settings',

  // Instructor
  INSTRUCTOR_DASHBOARD: '/instructor',
  INSTRUCTOR_COURSES: '/instructor/courses',
  INSTRUCTOR_COURSE_BUILDER: '/instructor/courses/create',
  INSTRUCTOR_COURSE_EDIT: '/instructor/courses/:courseId/edit',
  INSTRUCTOR_QUESTIONS: '/instructor/questions',
  INSTRUCTOR_STUDENTS: '/instructor/students',
  INSTRUCTOR_ANALYTICS: '/instructor/analytics',
  INSTRUCTOR_PROFILE: '/instructor/profile',

  // Admin
  ADMIN_DASHBOARD: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_COURSES: '/admin/courses',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_SETTINGS: '/admin/settings',
};
