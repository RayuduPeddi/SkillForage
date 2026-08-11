import React from 'react';
import { cn } from '../../utils/cn';

export function ProgressBar({
  value = 0,
  max = 100,
  size = 'md', // 'sm' | 'md' | 'lg'
  color = 'brand', // 'brand' | 'emerald' | 'amber' | 'rose' | 'slate'
  showLabel = false,
  className = '',
  barClassName = '',
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colors = {
    brand: 'bg-brand-600',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    slate: 'bg-slate-500',
  };

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600">
          <span>Progress</span>
          <span className="font-semibold text-slate-900">{percentage}%</span>
        </div>
      )}
      <div className={cn('w-full bg-slate-100 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn('h-full transition-all duration-500 ease-out rounded-full', colors[color], barClassName)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
