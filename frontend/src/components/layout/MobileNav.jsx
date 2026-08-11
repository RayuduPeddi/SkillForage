import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  STUDENT_NAV_ITEMS,
  INSTRUCTOR_NAV_ITEMS,
  ADMIN_NAV_ITEMS,
} from '../../constants/navigation';
import { ROLES } from '../../constants/roles';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';

export function MobileNav() {
  const { role } = useAuth();
  const location = useLocation();

  let items = STUDENT_NAV_ITEMS.slice(0, 5);
  if (role === ROLES.INSTRUCTOR) items = INSTRUCTOR_NAV_ITEMS.slice(0, 5);
  if (role === ROLES.ADMIN) items = ADMIN_NAV_ITEMS.slice(0, 5);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors',
              isActive ? 'text-brand-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
            )}
          >
            <Icon className={cn('w-5 h-5 mb-0.5', isActive ? 'text-brand-600' : 'text-slate-400')} />
            <span className="truncate max-w-[4.5rem]">{item.name}</span>
          </NavLink>
        );
      })}
    </div>
  );
}
