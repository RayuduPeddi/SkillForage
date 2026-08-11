import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

export function ProtectedRoute({ children, requireOnboarding = true }) {
  const { isAuthenticated, user, onboardingCompleted } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (requireOnboarding && !onboardingCompleted && user?.role === 'student') {
    return <Navigate to={ROUTES.ONBOARDING} replace />;
  }

  return children ? children : <Outlet />;
}
