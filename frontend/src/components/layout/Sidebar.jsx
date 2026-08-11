import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  STUDENT_NAV_ITEMS,
  STUDENT_SECONDARY_NAV,
  INSTRUCTOR_NAV_ITEMS,
  ADMIN_NAV_ITEMS,
} from '../../constants/navigation';
import { ROLES } from '../../constants/roles';
import { useAuth } from '../../hooks/useAuth';
import { Layers, Sparkles, LogOut } from 'lucide-react';
import { cn } from '../../utils/cn';

export function Sidebar({ className = '', onNavClick }) {
  const { role, user, logout } = useAuth();
  const location = useLocation();

  let mainNavItems = STUDENT_NAV_ITEMS;
  let secondaryNav = STUDENT_SECONDARY_NAV;

  if (role === ROLES.INSTRUCTOR) {
    mainNavItems = INSTRUCTOR_NAV_ITEMS;
    secondaryNav = [];
  } else if (role === ROLES.ADMIN) {
    mainNavItems = ADMIN_NAV_ITEMS;
    secondaryNav = [];
  }

  return (
    <aside
      className={cn(
        'w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-30',
        className
      )}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="font-display font-bold text-base text-slate-900 tracking-tight">SkillForage</span>
              <div className="flex items-center gap-1 -mt-0.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-600">Adaptive AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="px-3.5 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-10rem)]">
          <div className="space-y-1">
            <div className="px-2.5 mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              {role === ROLES.STUDENT ? 'Learning' : role === ROLES.INSTRUCTOR ? 'Instructor Space' : 'Administration'}
            </div>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onNavClick}
                  className={cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        'w-4 h-4 transition-colors',
                        isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'
                      )}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-full font-semibold',
                        item.badge === 'AI'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-brand-100 text-brand-700'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {secondaryNav.length > 0 && (
            <div className="space-y-1 pt-3 border-t border-slate-100">
              <div className="px-2.5 mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Account</div>
              {secondaryNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onNavClick}
                    className={cn(
                      'flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                      isActive
                        ? 'bg-brand-50 text-brand-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-4 h-4 transition-colors',
                        isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'
                      )}
                    />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          )}

          {/* Adaptive Learning Hint Card */}
          {role === ROLES.STUDENT && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Adaptive Engine</span>
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                Your path continuously recalibrates based on quiz speed and topic accuracy.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs shrink-0">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'Rayudu V.'}</p>
              <p className="text-xs text-slate-400 truncate capitalize">{role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
