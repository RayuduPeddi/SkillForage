import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { validateSignupForm } from '../../utils/validation';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

export function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const { signup, isLoading } = useAuth();
  const { error: toastError, success: toastSuccess } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateSignupForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await signup(formData);
      if (res.meta?.requestStatus === 'fulfilled') {
        toastSuccess('Account Created', 'Welcome to SkillForage! Let’s personalize your curriculum.');
        // Direct new student to onboarding flow!
        navigate(ROUTES.ONBOARDING);
      } else {
        toastError('Signup Failed', res.payload || 'Could not register account');
      }
    } catch (err) {
      toastError('Signup Failed', err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-slate-900">Create your account</h2>
        <p className="text-xs text-slate-500">Join SkillForage to build your personalized adaptive learning path</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="e.g. Rayudu Varma"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={errors.name}
          leftIcon={User}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="name@university.edu"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          leftIcon={Mail}
        />

        <Input
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          error={errors.password}
          leftIcon={Lock}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Re-enter password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
          leftIcon={Lock}
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          isLoading={isLoading}
          leftIcon={UserPlus}
        >
          Create Account & Start Onboarding
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="font-semibold text-brand-600 hover:text-brand-700">
          Sign in
        </Link>
      </div>
    </div>
  );
}
