import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';

// Layouts
import { StudentLayout } from '../components/layout/StudentLayout';
import { InstructorLayout } from '../components/layout/InstructorLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { AuthLayout } from '../components/layout/AuthLayout';

// Route Guards
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Signup } from '../pages/auth/Signup';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';
import { Onboarding } from '../pages/auth/Onboarding';

// Student Pages
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { MyLearning } from '../pages/student/MyLearning';
import { ExploreCourses } from '../pages/student/ExploreCourses';
import { CourseDetails } from '../pages/student/CourseDetails';
import { CourseLearn } from '../pages/student/CourseLearn';
import { QuizPage } from '../pages/student/QuizPage';
import { QuizResultsPage } from '../pages/student/QuizResultsPage';
import { LearningAnalysis } from '../pages/student/LearningAnalysis';
import { PersonalizedLearningPath } from '../pages/student/PersonalizedLearningPath';
import { PracticePage } from '../pages/student/PracticePage';
import { AIMentorPage } from '../pages/student/AIMentorPage';
import { ProgressPage } from '../pages/student/ProgressPage';
import { StudentProfile } from '../pages/student/StudentProfile';
import { StudentSettings } from '../pages/student/StudentSettings';

// Instructor Pages
import { InstructorDashboard } from '../pages/instructor/InstructorDashboard';
import { InstructorCourses } from '../pages/instructor/InstructorCourses';
import { CourseBuilder } from '../pages/instructor/CourseBuilder';
import { QuestionBank } from '../pages/instructor/QuestionBank';
import { StudentAnalytics } from '../pages/instructor/StudentAnalytics';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { UserManagement } from '../pages/admin/UserManagement';
import { CourseModeration } from '../pages/admin/CourseModeration';
import { PlatformReports } from '../pages/admin/PlatformReports';
import { AdminSettings } from '../pages/admin/AdminSettings';

// Not Found
import { NotFound } from '../pages/NotFound';

export function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />

      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<Signup />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
      </Route>

      {/* Onboarding Route (Protected but does not require completed onboarding) */}
      <Route
        path={ROUTES.ONBOARDING}
        element={
          <ProtectedRoute requireOnboarding={false}>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      {/* Student Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={[ROLES.STUDENT, ROLES.INSTRUCTOR, ROLES.ADMIN]}>
              <StudentLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.DASHBOARD} element={<StudentDashboard />} />
        <Route path={ROUTES.MY_LEARNING} element={<MyLearning />} />
        <Route path={ROUTES.COURSES} element={<ExploreCourses />} />
        <Route path={ROUTES.COURSE_DETAILS} element={<CourseDetails />} />
        <Route path={ROUTES.COURSE_LEARN} element={<CourseLearn />} />
        <Route path={ROUTES.QUIZ} element={<QuizPage />} />
        <Route path={ROUTES.QUIZ_RESULTS} element={<QuizResultsPage />} />
        <Route path={ROUTES.LEARNING_ANALYSIS} element={<LearningAnalysis />} />
        <Route path={ROUTES.LEARNING_PATH} element={<PersonalizedLearningPath />} />
        <Route path={ROUTES.PRACTICE} element={<PracticePage />} />
        <Route path={ROUTES.AI_MENTOR} element={<AIMentorPage />} />
        <Route path={ROUTES.PROGRESS} element={<ProgressPage />} />
        <Route path={ROUTES.STUDENT_PROFILE} element={<StudentProfile />} />
        <Route path={ROUTES.STUDENT_SETTINGS} element={<StudentSettings />} />
      </Route>

      {/* Instructor Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={[ROLES.INSTRUCTOR, ROLES.ADMIN]} fallbackPath={ROUTES.DASHBOARD}>
              <InstructorLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.INSTRUCTOR_DASHBOARD} element={<InstructorDashboard />} />
        <Route path={ROUTES.INSTRUCTOR_COURSES} element={<InstructorCourses />} />
        <Route path={ROUTES.INSTRUCTOR_COURSE_BUILDER} element={<CourseBuilder />} />
        <Route path={ROUTES.INSTRUCTOR_COURSE_EDIT} element={<CourseBuilder />} />
        <Route path={ROUTES.INSTRUCTOR_QUESTIONS} element={<QuestionBank />} />
        <Route path={ROUTES.INSTRUCTOR_STUDENTS} element={<StudentAnalytics />} />
        <Route path={ROUTES.INSTRUCTOR_ANALYTICS} element={<StudentAnalytics />} />
        <Route path={ROUTES.INSTRUCTOR_PROFILE} element={<StudentProfile />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={[ROLES.ADMIN]} fallbackPath={ROUTES.DASHBOARD}>
              <AdminLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
        <Route path={ROUTES.ADMIN_USERS} element={<UserManagement />} />
        <Route path={ROUTES.ADMIN_COURSES} element={<CourseModeration />} />
        <Route path={ROUTES.ADMIN_REPORTS} element={<PlatformReports />} />
        <Route path={ROUTES.ADMIN_SETTINGS} element={<AdminSettings />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
