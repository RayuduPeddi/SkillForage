import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { formatDuration } from '../../utils/formatters';

export function QuizTimer({ initialSeconds = 600, onTimeUp, isRunning = true }) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, isRunning, onTimeUp]);

  const isLowTime = secondsLeft < 60;

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-colors ${
        isLowTime
          ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse'
          : 'bg-slate-100 border-slate-200 text-slate-700'
      }`}
    >
      <Clock className="w-3.5 h-3.5" />
      <span>{formatDuration(secondsLeft)} remaining</span>
    </div>
  );
}
