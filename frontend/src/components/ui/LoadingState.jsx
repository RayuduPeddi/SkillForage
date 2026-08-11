import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingState({
  message = 'Loading data...',
  description = 'Please wait while we prepare your adaptive content',
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 mb-3 animate-spin">
        <Loader2 className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold text-slate-800">{message}</h4>
      {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
    </div>
  );
}
