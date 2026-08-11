import React from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CheckCircle2, ChevronLeft, ChevronRight, HelpCircle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LessonContent({
  lesson,
  courseId,
  isCompleted,
  onMarkComplete,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}) {
  const navigate = useNavigate();

  if (!lesson) {
    return <div className="p-8 text-center text-slate-400 text-xs">Select a lesson to begin learning.</div>;
  }

  const isQuiz = lesson.type === 'quiz' || !!lesson.quizId;

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant={isQuiz ? 'warning' : 'primary'} size="sm">
              {isQuiz ? 'Diagnostic Quiz' : 'Core Lesson'}
            </Badge>
            <span className="text-xs text-slate-500 font-mono">{lesson.duration || '20 mins'}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">{lesson.title}</h1>
        </div>

        {/* Action button */}
        <div>
          {isQuiz ? (
            <Button
              variant="primary"
              size="md"
              leftIcon={HelpCircle}
              onClick={() => navigate(`/quiz/${lesson.quizId || 'quiz-prefix-sum'}`)}
            >
              Start Quiz Assessment
            </Button>
          ) : (
            <Button
              variant={isCompleted ? 'success' : 'primary'}
              size="md"
              leftIcon={CheckCircle2}
              onClick={onMarkComplete}
            >
              {isCompleted ? 'Completed ✓' : 'Mark as Complete'}
            </Button>
          )}
        </div>
      </div>

      {/* Lesson Text / Notes Content */}
      <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-4">
        <h3 className="text-base font-semibold text-slate-900">Key Concepts & Algorithmic Notes</h3>
        <p>
          In this section, we analyze the structural mechanics of <strong>{lesson.title}</strong>.
          Pay close attention to boundary invariants, memory footprint, and asymptotic run-time analysis.
        </p>

        <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto shadow-inner">
          <pre className="text-emerald-400 font-medium">// Invariant property check</pre>
          <pre className="text-slate-300">
            {`def solve(arr):\n    # 1. Precompute prefix sums\n    prefix = [0] * (len(arr) + 1)\n    for i, x in enumerate(arr):\n        prefix[i + 1] = prefix[i] + x\n    return prefix`}
          </pre>
        </div>

        <p className="text-xs text-slate-500">
          💡 <em>Adaptive Note:</em> After finishing this lecture, test your understanding on the diagnostic quiz to update your personalized topic mastery profile.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200/80">
        <Button
          variant="outline"
          size="sm"
          leftIcon={ChevronLeft}
          onClick={onPrevious}
          disabled={!hasPrevious}
        >
          Previous Lesson
        </Button>

        <Button
          variant="primary"
          size="sm"
          rightIcon={ChevronRight}
          onClick={onNext}
          disabled={!hasNext}
        >
          Next Lesson
        </Button>
      </div>
    </div>
  );
}
