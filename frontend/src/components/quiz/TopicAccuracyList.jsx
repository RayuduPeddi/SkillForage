import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { calculateMasteryCategory } from '../../utils/calculations';

export function TopicAccuracyList({ topics = [] }) {
  if (!topics.length) return null;

  return (
    <div className="space-y-3">
      {topics.map((t) => {
        const accuracy = t.accuracy !== undefined ? t.accuracy : Math.round((t.correct / t.total) * 100);
        const { status, color, bgClass } = calculateMasteryCategory(accuracy);

        return (
          <div
            key={t.topic || t.id}
            className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
          >
            <div className="space-y-1 min-w-[12rem]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{t.topic}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${bgClass}`}>
                  {status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                {t.attempts ? `${t.attempts} attempts` : `${t.correct || 0}/${t.total || 0} questions correct`}
              </p>
            </div>

            <div className="flex-1 max-w-xs space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                <span>Accuracy</span>
                <span className="font-mono">{accuracy}%</span>
              </div>
              <ProgressBar
                value={accuracy}
                size="sm"
                color={color === 'emerald' ? 'emerald' : color === 'amber' ? 'amber' : 'rose'}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
