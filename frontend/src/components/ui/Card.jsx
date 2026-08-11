import React from 'react';
import { cn } from '../../utils/cn';

export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-slate-200/90 shadow-card overflow-hidden',
        hover && 'transition-all duration-150 hover:border-slate-300 hover:shadow-card-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', action }) {
  return (
    <div className={cn('px-6 py-4 border-b border-slate-100 flex items-center justify-between', className)}>
      <div className="space-y-0.5">{children}</div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={cn('text-base font-semibold text-slate-900 tracking-tight', className)}>{children}</h3>;
}

export function CardDescription({ children, className = '' }) {
  return <p className={cn('text-xs text-slate-500', className)}>{children}</p>;
}

export function CardContent({ children, className = '' }) {
  return <div className={cn('p-6', className)}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={cn('px-6 py-3.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between', className)}>{children}</div>;
}
