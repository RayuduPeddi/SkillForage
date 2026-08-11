import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';

export function QuestionCard({
  question,
  selectedOption,
  onSelectOption,
  index = 0,
}) {
  if (!question) return null;

  return (
    <Card className="p-6 sm:p-8 space-y-6 shadow-sm border border-slate-200">
      {/* Header tags */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="sm">
            {question.topic}
          </Badge>
          <Badge variant="outline" size="sm">
            {question.difficulty}
          </Badge>
        </div>
        <span className="text-xs font-mono font-semibold text-slate-400">
          Q{index + 1}
        </span>
      </div>

      {/* Question Text */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">
          {question.question}
        </h2>

        {question.codeSnippet && (
          <div className="bg-slate-900 text-slate-100 p-3.5 rounded-lg font-mono text-xs overflow-x-auto shadow-inner">
            <pre>{question.codeSnippet}</pre>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {question.options.map((opt, i) => {
          const isSelected = selectedOption === opt.id;
          const letter = String.fromCharCode(65 + i); // A, B, C, D

          return (
            <div
              key={opt.id}
              onClick={() => onSelectOption(opt.id)}
              className={cn(
                'flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition-all',
                isSelected
                  ? 'border-brand-600 bg-brand-50/70 text-brand-900 shadow-xs ring-1 ring-brand-500/20 font-semibold'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 text-slate-700'
              )}
            >
              <div
                className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors',
                  isSelected
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                )}
              >
                {letter}
              </div>
              <span className="flex-1 leading-relaxed">{opt.text}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
