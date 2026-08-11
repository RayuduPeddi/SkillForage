import React from 'react';
import { Card } from '../ui/Card';
import { Award, Target, Flame, CheckCircle, BarChart2 } from 'lucide-react';

export function ProgressSummaryCard({
  overallMastery = 72,
  quizAccuracy = 72,
  masteredCount = 2,
  streak = 14,
}) {
  const stats = [
    {
      label: 'Overall Mastery',
      value: `${overallMastery}%`,
      icon: Award,
      color: 'text-brand-600',
      bg: 'bg-brand-50',
      detail: 'Weighted across all topics',
    },
    {
      label: 'Quiz Accuracy',
      value: `${quizAccuracy}%`,
      icon: Target,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      detail: 'Diagnostic average',
    },
    {
      label: 'Topics Mastered',
      value: `${masteredCount}`,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      detail: '≥ 80% accuracy tier',
    },
    {
      label: 'Learning Streak',
      value: `${streak} Days`,
      icon: Flame,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      detail: 'Daily practice active',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <Card key={idx} className="p-4 sm:p-5 border-slate-200 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500">{stat.label}</span>
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-xl sm:text-2xl font-bold font-mono text-slate-900">{stat.value}</p>
              <p className="text-[11px] text-slate-400">{stat.detail}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
