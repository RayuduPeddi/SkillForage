import { useSelector, useDispatch } from 'react-redux';
import { loginUser, signupUser, logout, setRole, completeOnboarding } from '../store/slices/authSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  return {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    role: auth.user?.role || 'student',
    onboardingCompleted: auth.user?.onboardingCompleted ?? true,
    login: (creds) => dispatch(loginUser(creds)),
    signup: (data) => dispatch(signupUser(data)),
    logout: () => dispatch(logout()),
    switchRole: (newRole) => dispatch(setRole(newRole)),
    completeOnboarding: (data) => dispatch(completeOnboarding(data)),
  };
}
