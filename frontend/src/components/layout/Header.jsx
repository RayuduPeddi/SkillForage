import React, { useState } from 'react';
import { Menu, Bell, GraduationCap, Presentation, Shield, User, Settings, LogOut, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Dropdown, DropdownItem } from '../ui/Dropdown';
import { Avatar } from '../ui/Avatar';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';

export function Header({ onMenuToggle }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(2);

  // Helper to determine page title from path
  const getPageContext = () => {
    const path = location.pathname;
    if (path.includes('/ai-mentor')) return 'AI Academic Mentor';
    if (path.includes('/dashboard')) return role === ROLES.STUDENT ? 'Student Dashboard' : role === ROLES.INSTRUCTOR ? 'Instructor Dashboard' : 'Admin Overview';
    if (path.includes('/courses')) return 'Courses & Curriculum';
    if (path.includes('/learning-path')) return 'Personalized Adaptive Path';
    if (path.includes('/practice')) return 'Adaptive Practice Arena';
    if (path.includes('/quiz')) return 'Diagnostic Assessment';
    if (path.includes('/my-learning')) return 'My Learning Space';
    if (path.includes('/profile')) return 'Profile & Achievements';
    if (path.includes('/settings')) return 'Account Settings';
    if (path.includes('/instructor/questions')) return 'Question Bank';
    if (path.includes('/instructor/analytics') || path.includes('/instructor/students')) return 'Student Analytics';
    if (path.includes('/admin/users')) return 'User Directory';
    if (path.includes('/admin/courses')) return 'Course Moderation';
    if (path.includes('/admin/reports')) return 'Platform Intelligence Reports';
    return 'SkillForage Workspace';
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between">
      {/* Left side: Mobile menu toggle + clean contextual title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 text-sm sm:text-base tracking-tight">
            {getPageContext()}
          </span>
        </div>
      </div>

      {/* Right side: Role badge, notifications bell, user profile dropdown */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Role contextual badge */}
        {role === ROLES.STUDENT && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200/80 shadow-2xs">
            <GraduationCap className="w-3.5 h-3.5 text-brand-600" />
            Student Workspace
          </span>
        )}

        {role === ROLES.INSTRUCTOR && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
            <Presentation className="w-3.5 h-3.5 text-amber-600" />
            Instructor Portal
          </span>
        )}

        {role === ROLES.ADMIN && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200/80 shadow-2xs">
            <Shield className="w-3.5 h-3.5 text-purple-600" />
            Admin Center
          </span>
        )}

        {/* Notifications Dropdown */}
        <Dropdown
          trigger={
            <button
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
              title="Notifications"
              onClick={() => setUnreadCount(0)}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>
          }
        >
          <div className="w-72 p-1">
            <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Notifications</span>
              <span className="text-[10px] text-slate-400">Live</span>
            </div>
            <div className="py-1 space-y-1">
              <div className="px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                <p className="text-xs font-semibold text-slate-800">Adaptive Diagnostic Updated</p>
                <p className="text-[11px] text-slate-500">Prefix Sum accuracy adjusted to 43% from your recent quiz.</p>
              </div>
              <div className="px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                <p className="text-xs font-semibold text-slate-800">New AI Practice Drills</p>
                <p className="text-[11px] text-slate-500">3 custom problems generated for your current focus topic.</p>
              </div>
            </div>
          </div>
        </Dropdown>

        {/* User profile dropdown */}
        <Dropdown
          trigger={
            <button className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
              <Avatar name={user?.name || 'Rayudu V.'} size="sm" />
            </button>
          }
        >
          <div className="px-3 py-2 border-b border-slate-100 mb-1">
            <p className="text-xs font-bold text-slate-900">{user?.name || 'Rayudu V.'}</p>
            <p className="text-[11px] text-slate-500">{user?.email || 'rayudu@skillforage.edu'}</p>
            <div className="mt-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 capitalize">
                Role: {role}
              </span>
            </div>
          </div>

          {role === ROLES.STUDENT && (
            <>
              <DropdownItem onClick={() => navigate(ROUTES.STUDENT_PROFILE)}>View Profile</DropdownItem>
              <DropdownItem onClick={() => navigate(ROUTES.STUDENT_SETTINGS)}>Settings</DropdownItem>
              <DropdownItem onClick={() => navigate(ROUTES.LEARNING_PATH)}>Adaptive Path</DropdownItem>
              <DropdownItem onClick={() => navigate(ROUTES.AI_MENTOR)}>AI Academic Mentor</DropdownItem>
            </>
          )}

          {role === ROLES.INSTRUCTOR && (
            <>
              <DropdownItem onClick={() => navigate(ROUTES.INSTRUCTOR_DASHBOARD)}>Instructor Dashboard</DropdownItem>
              <DropdownItem onClick={() => navigate(ROUTES.INSTRUCTOR_COURSES)}>My Courses</DropdownItem>
              <DropdownItem onClick={() => navigate(ROUTES.INSTRUCTOR_QUESTIONS)}>Question Bank</DropdownItem>
              <DropdownItem onClick={() => navigate(ROUTES.INSTRUCTOR_ANALYTICS)}>Student Analytics</DropdownItem>
            </>
          )}

          {role === ROLES.ADMIN && (
            <>
              <DropdownItem onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}>Admin Dashboard</DropdownItem>
              <DropdownItem onClick={() => navigate(ROUTES.ADMIN_USERS)}>User Directory</DropdownItem>
              <DropdownItem onClick={() => navigate(ROUTES.ADMIN_COURSES)}>Course Moderation</DropdownItem>
              <DropdownItem onClick={() => navigate(ROUTES.ADMIN_REPORTS)}>Platform Reports</DropdownItem>
            </>
          )}

          <div className="my-1 border-t border-slate-100" />
          <DropdownItem onClick={logout} danger>
            Sign Out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
