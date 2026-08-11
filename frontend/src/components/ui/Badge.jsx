import React from 'react';
import { cn } from '../../utils/cn';

export function Badge({
  children,
  variant = 'default', // 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline' | 'purple'
  size = 'md', // 'sm' | 'md'
  className = '',
  icon: Icon,
}) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-brand-50 text-brand-700 border-brand-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    outline: 'border border-slate-200 text-slate-600 bg-white',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5 gap-1 font-medium',
    md: 'text-sm px-3 py-1 gap-1.5 font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border border-transparent select-none',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      {children}
    </span>
  );
}
