import React from 'react';
import { ProgressBar } from '../ui/ProgressBar';

export function QuizProgress({ current = 1, total = 5, answeredCount = 0 }) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>
          Question <strong className="text-slate-900 font-mono">{current}</strong> of {total}
        </span>
        <span>
          {answeredCount} answered ({total - answeredCount} left)
        </span>
      </div>
      <ProgressBar value={current} max={total} size="sm" color="brand" />
    </div>
  );
}
