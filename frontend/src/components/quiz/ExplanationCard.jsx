import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CheckCircle2, XCircle, HelpCircle, BookOpen } from 'lucide-react';
import { cn } from '../../utils/cn';

export function ExplanationCard({ evaluatedQuestions = [] }) {
  if (!evaluatedQuestions.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
        Detailed Question-by-Question Breakdown
      </h3>

      <div className="space-y-4">
        {evaluatedQuestions.map((q, idx) => {
          const isCorrect = q.isCorrect;

          return (
            <Card
              key={q.id || idx}
              className={cn(
                'p-5 border space-y-4 transition-colors',
                isCorrect ? 'border-emerald-200/90 bg-white' : 'border-rose-200/90 bg-rose-50/20'
              )}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <div className="p-1 rounded-full bg-emerald-100 text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="p-1 rounded-full bg-rose-100 text-rose-700">
                      <XCircle className="w-4 h-4" />
                    </div>
                  )}
                  <span className="text-xs font-mono font-bold text-slate-500">Question {idx + 1}</span>
                  <Badge variant={isCorrect ? 'success' : 'danger'} size="sm">
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" size="sm">
                    {q.topic}
                  </Badge>
                  <span className="text-xs text-slate-400 font-mono">{q.difficulty}</span>
                </div>
              </div>

              {/* Question Text */}
              <p className="text-sm font-semibold text-slate-900 leading-relaxed">{q.question}</p>

              {/* Options list showing user choice vs correct */}
              <div className="space-y-2 pt-1">
                {q.options?.map((opt) => {
                  const isUserSelection = q.userAnswer === opt.id;
                  const isRightAnswer = q.correctAnswer === opt.id;

                  let optStyle = 'border-slate-200 bg-white text-slate-700';
                  if (isRightAnswer) {
                    optStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-900 font-semibold';
                  } else if (isUserSelection && !isCorrect) {
                    optStyle = 'border-rose-500 bg-rose-50 text-rose-900 line-through';
                  }

                  return (
                    <div
                      key={opt.id}
                      className={cn('flex items-center justify-between p-2.5 rounded-lg border text-xs', optStyle)}
                    >
                      <span>{opt.text}</span>
                      {isRightAnswer && (
                        <span className="text-[11px] font-bold text-emerald-700">Correct Answer</span>
                      )}
                      {isUserSelection && !isRightAnswer && (
                        <span className="text-[11px] font-bold text-rose-700">Your Selection</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {q.explanation && (
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                    <BookOpen className="w-3.5 h-3.5 text-brand-600" />
                    <span>Academic Explanation</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
