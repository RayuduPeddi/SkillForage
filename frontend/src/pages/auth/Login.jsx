import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { validateLoginForm } from '../../utils/validation';
import { Mail, Lock, LogIn, GraduationCap, Presentation, Shield, KeyRound } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

export function Login() {
  const [formData, setFormData] = useState({
    email: 'rayudu@skillforage.edu',
    password: 'rayudu123',
    remember: true,
  });
  const [errors, setErrors] = useState({});
  const { login, isLoading } = useAuth();
  const { error: toastError, success: toastSuccess } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleQuickLogin = async (roleEmail, rolePassword, roleName) => {
    setFormData({
      email: roleEmail,
      password: rolePassword,
      remember: true,
    });

    try {
      const res = await login({ email: roleEmail, password: rolePassword, remember: true });
      if (res.meta?.requestStatus === 'fulfilled') {
        const user = res.payload.user;
        toastSuccess('Signed In', `Welcome back, ${user.name}!`);
        if (user.role === 'instructor') navigate(ROUTES.INSTRUCTOR_DASHBOARD);
        else if (user.role === 'admin') navigate(ROUTES.ADMIN_DASHBOARD);
        else navigate(ROUTES.DASHBOARD);
      } else {
        toastError('Login Failed', res.payload || 'Invalid credentials');
      }
    } catch (err) {
      toastError('Login Failed', err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLoginForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await login(formData);
      if (res.meta?.requestStatus === 'fulfilled') {
        const user = res.payload.user;
        toastSuccess('Signed In', `Welcome back, ${user.name}!`);

        if (!user.onboardingCompleted) {
          navigate(ROUTES.ONBOARDING);
        } else if (user.role === 'instructor') {
          navigate(ROUTES.INSTRUCTOR_DASHBOARD);
        } else if (user.role === 'admin') {
          navigate(ROUTES.ADMIN_DASHBOARD);
        } else {
          navigate(ROUTES.DASHBOARD);
        }
      } else {
        toastError('Login Failed', res.payload || 'Invalid credentials');
      }
    } catch (err) {
      toastError('Login Failed', err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-slate-900">Sign in to SkillForage</h2>
        <p className="text-xs text-slate-500">Access your role-specific dashboard and tools</p>
      </div>

      {/* Quick Role Sign-in Helper with exact credentials */}
      <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2.5 shadow-2xs">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center">
          1-Click Role Login
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Student */}
          <button
            type="button"
            onClick={() => handleQuickLogin('rayudu@skillforage.edu', 'rayudu123', 'Student')}
            className="flex flex-col p-2.5 rounded-xl bg-white border border-slate-200 hover:border-brand-500 hover:bg-brand-50/40 text-slate-700 text-left transition-all shadow-2xs group"
          >
            <div className="flex items-center gap-1.5 font-bold text-xs text-brand-700 mb-1">
              <GraduationCap className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Student</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono truncate">rayudu@skillforage.edu</p>
            <p className="text-[10px] text-slate-400 font-mono">pwd: rayudu123</p>
          </button>

          {/* Instructor */}
          <button
            type="button"
            onClick={() => handleQuickLogin('instructor@skillforage.edu', 'instructor123', 'Instructor')}
            className="flex flex-col p-2.5 rounded-xl bg-white border border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 text-slate-700 text-left transition-all shadow-2xs group"
          >
            <div className="flex items-center gap-1.5 font-bold text-xs text-amber-700 mb-1">
              <Presentation className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Instructor</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono truncate">instructor@skillforage.edu</p>
            <p className="text-[10px] text-slate-400 font-mono">pwd: instructor123</p>
          </button>

          {/* Admin */}
          <button
            type="button"
            onClick={() => handleQuickLogin('admin@skillforage.edu', 'admin123', 'Admin')}
            className="flex flex-col p-2.5 rounded-xl bg-white border border-slate-200 hover:border-purple-500 hover:bg-purple-50/40 text-slate-700 text-left transition-all shadow-2xs group"
          >
            <div className="flex items-center gap-1.5 font-bold text-xs text-purple-700 mb-1">
              <Shield className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Admin</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono truncate">admin@skillforage.edu</p>
            <p className="text-[10px] text-slate-400 font-mono">pwd: admin123</p>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@skillforage.edu"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          leftIcon={Mail}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          error={errors.password}
          leftIcon={Lock}
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
            <input
              type="checkbox"
              checked={formData.remember}
              onChange={(e) => handleInputChange('remember', e.target.checked)}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span>Remember session</span>
          </label>

          <Link to={ROUTES.FORGOT_PASSWORD} className="font-medium text-brand-600 hover:text-brand-700">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full font-semibold"
          isLoading={isLoading}
          leftIcon={LogIn}
        >
          Sign In
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
        Don't have an account?{' '}
        <Link to={ROUTES.SIGNUP} className="font-semibold text-brand-600 hover:text-brand-700">
          Create student account
        </Link>
      </div>
    </div>
  );
}

