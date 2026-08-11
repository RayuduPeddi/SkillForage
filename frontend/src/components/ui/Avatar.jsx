import React from 'react';
import { cn } from '../../utils/cn';

export function Avatar({
  src,
  name = '',
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  className = '',
  status, // 'online' | 'busy' | 'offline'
}) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  const statusColors = {
    online: 'bg-emerald-500',
    busy: 'bg-amber-500',
    offline: 'bg-slate-400',
  };

  return (
    <div className="relative inline-flex shrink-0">
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn('rounded-full object-cover border border-slate-200 shadow-xs', sizes[size], className)}
        />
      ) : (
        <div
          className={cn(
            'rounded-full bg-brand-100 text-brand-700 font-semibold flex items-center justify-center border border-brand-200 select-none',
            sizes[size],
            className
          )}
        >
          {initials}
        </div>
      )}

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
            size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5',
            statusColors[status]
          )}
        />
      )}
    </div>
  );
}
