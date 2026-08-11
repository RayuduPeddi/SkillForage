import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizScoreCard } from '../../components/quiz/QuizScoreCard';
import { TopicAccuracyList } from '../../components/quiz/TopicAccuracyList';
import { ExplanationCard } from '../../components/quiz/ExplanationCard';
import { Button } from '../../components/ui/Button';
import { useSelector } from 'react-redux';
import { BarChart3, ArrowRight, RotateCcw, Home, Sparkles } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

export function QuizResultsPage() {
  const navigate = useNavigate();
  const lastResult = useSelector((state) => state.quiz.lastResult);

  if (!lastResult) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">No Assessment Results Found</h2>
        <p className="text-xs text-slate-500">Please take a quiz to review your adaptive performance score.</p>
        <Button onClick={() => navigate(ROUTES.DASHBOARD)} leftIcon={Home}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Banner with direct Adaptive CTA */}
      <div className="bg-brand-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-card">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-800 text-brand-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Adaptive Learning Analysis Ready</h3>
            <p className="text-xs text-slate-300">
              Your topic accuracy has been analyzed. Check your updated strengths and revision steps.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          className="bg-brand-600 hover:bg-brand-500 text-white shrink-0"
          rightIcon={ArrowRight}
          onClick={() => navigate(ROUTES.LEARNING_ANALYSIS)}
        >
          View Full Learning Analysis
        </Button>
      </div>

      {/* 1. Score Summary Card */}
      <QuizScoreCard result={lastResult} />

      {/* 2. Topic Accuracy breakdown for this quiz */}
      {lastResult.topicBreakdown && lastResult.topicBreakdown.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Quiz Topic Performance
          </h3>
          <TopicAccuracyList topics={lastResult.topicBreakdown} />
        </div>
      )}

      {/* 3. Detailed Question Explanations */}
      <ExplanationCard evaluatedQuestions={lastResult.evaluatedQuestions || []} />

      {/* Footer Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200">
        <Button
          variant="outline"
          size="sm"
          leftIcon={Home}
          onClick={() => navigate(ROUTES.DASHBOARD)}
        >
          Back to Dashboard
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.PRACTICE)}
          >
            Practice Weak Topics
          </Button>
          <Button
            variant="primary"
            size="sm"
            rightIcon={BarChart3}
            onClick={() => navigate(ROUTES.LEARNING_ANALYSIS)}
          >
            View Adaptive Recommendations
          </Button>
        </div>
      </div>
    </div>
  );
}
