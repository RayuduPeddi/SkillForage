import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES, ROLE_LABELS } from '../../constants/roles';
import { Shield, GraduationCap, Presentation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export function RoleSwitcher() {
  const { role, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    switchRole(newRole);
    if (newRole === ROLES.STUDENT) navigate(ROUTES.DASHBOARD);
    if (newRole === ROLES.INSTRUCTOR) navigate(ROUTES.INSTRUCTOR_DASHBOARD);
    if (newRole === ROLES.ADMIN) navigate(ROUTES.ADMIN_DASHBOARD);
  };

  return (
    <div className="flex items-center bg-slate-100/90 rounded-lg p-0.5 border border-slate-200 text-xs">
      <button
        onClick={() => handleRoleChange(ROLES.STUDENT)}
        className={`flex items-center gap-1 px-2 py-1 rounded-md font-medium transition-all ${
          role === ROLES.STUDENT
            ? 'bg-white text-brand-700 shadow-xs font-semibold'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        title="Switch to Student view"
      >
        <GraduationCap className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Student</span>
      </button>

      <button
        onClick={() => handleRoleChange(ROLES.INSTRUCTOR)}
        className={`flex items-center gap-1 px-2 py-1 rounded-md font-medium transition-all ${
          role === ROLES.INSTRUCTOR
            ? 'bg-white text-brand-700 shadow-xs font-semibold'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        title="Switch to Instructor view"
      >
        <Presentation className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Instructor</span>
      </button>

      <button
        onClick={() => handleRoleChange(ROLES.ADMIN)}
        className={`flex items-center gap-1 px-2 py-1 rounded-md font-medium transition-all ${
          role === ROLES.ADMIN
            ? 'bg-white text-brand-700 shadow-xs font-semibold'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        title="Switch to Admin view"
      >
        <Shield className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Admin</span>
      </button>
    </div>
  );
}
