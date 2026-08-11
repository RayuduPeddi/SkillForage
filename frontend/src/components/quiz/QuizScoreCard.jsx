import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CheckCircle2, XCircle, Award, Target, Clock } from 'lucide-react';
import { formatDuration } from '../../utils/formatters';

export function QuizScoreCard({ result }) {
  if (!result) return null;

  const isPassing = result.score >= 70;

  return (
    <Card className="p-6 sm:p-8 bg-gradient-to-b from-white to-slate-50 border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        {/* Score Ring */}
        <div className="flex items-center gap-5">
          <div
            className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-display font-extrabold text-2xl shadow-sm border ${
              isPassing
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            <span>{result.score}%</span>
            <span className="text-[10px] font-sans font-medium uppercase tracking-wider -mt-1">Score</span>
          </div>

          <div className="space-y-1">
            <Badge variant={isPassing ? 'success' : 'danger'} size="sm">
              {isPassing ? 'Assessment Passed' : 'Diagnostic Revision Recommended'}
            </Badge>
            <h2 className="text-lg font-bold text-slate-900">{result.quizTitle}</h2>
            <p className="text-xs text-slate-500">
              Submitted on {new Date(result.submittedAt).toLocaleDateString()} • {result.correctCount} of {result.totalQuestions} correct
            </p>
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div className="grid grid-cols-2 gap-3 sm:border-l sm:border-slate-200 sm:pl-6">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Correct</span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>{result.correctCount}</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Incorrect</span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-rose-600">
              <XCircle className="w-4 h-4" />
              <span>{result.totalQuestions - result.correctCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
