import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useAdaptiveEngine } from '../../hooks/useAdaptiveEngine';
import { useNavigate } from 'react-router-dom';
import {
  GitFork,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Target,
  RotateCcw,
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';

export function PersonalizedLearningPath() {
  const { learningPath, overallMastery, refreshAdaptiveData } = useAdaptiveEngine();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="purple" size="sm">
                Real-Time Adaptation
              </Badge>
              <span className="text-xs text-slate-500 font-mono">Dynamic Node Graph</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Personalized Learning Path</h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              This sequential path dynamically re-orders based on your quiz accuracy, identified prerequisite gaps, and topic mastery speed.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            leftIcon={RotateCcw}
            onClick={refreshAdaptiveData}
          >
            Recalibrate Path
          </Button>
        </div>
      </div>

      {/* Structured Path Vertical Graph */}
      <div className="space-y-4">
        <div className="relative pl-8 sm:pl-10 space-y-6 before:absolute before:left-3.5 sm:before:left-4.5 before:top-4 before:bottom-4 before:w-1 before:bg-slate-200">
          {learningPath.map((item, idx) => {
            const isCompleted = item.status === 'completed';
            const isCurrent = item.status === 'current';
            const isRecommended = item.status === 'recommended';
            const isUpcoming = item.status === 'upcoming';

            return (
              <div key={item.id || idx} className="relative group">
                {/* Node indicator */}
                <div
                  className={`absolute -left-8 sm:-left-10 top-3 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-110 ${
                    isCompleted
                      ? 'bg-emerald-500 ring-4 ring-emerald-50'
                      : isCurrent
                      ? 'bg-brand-600 ring-4 ring-brand-100 animate-pulse'
                      : isRecommended
                      ? 'bg-purple-600 ring-4 ring-purple-100'
                      : 'bg-slate-300 ring-4 ring-slate-100'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isCurrent ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-white" />
                  ) : isRecommended ? (
                    <Sparkles className="w-4 h-4" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400" />
                  )}
                </div>

                {/* Node Card */}
                <Card
                  className={`p-5 sm:p-6 transition-all ${
                    isCurrent
                      ? 'border-brand-300 bg-brand-50/20 shadow-md ring-1 ring-brand-500/20'
                      : isRecommended
                      ? 'border-purple-300 bg-purple-50/20 shadow-sm'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-bold text-slate-900">{item.topic}</span>
                        {isCompleted && (
                          <Badge variant="success" size="sm">
                            ✓ Completed ({item.accuracy}%)
                          </Badge>
                        )}
                        {isCurrent && (
                          <Badge variant="primary" size="sm">
                            ● Current Focus
                          </Badge>
                        )}
                        {isRecommended && (
                          <Badge variant="purple" size="sm">
                            → Recommended After Current
                          </Badge>
                        )}
                        {isUpcoming && (
                          <Badge variant="default" size="sm">
                            ○ Upcoming
                          </Badge>
                        )}
                        {item.adaptiveFlag && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
                            {item.adaptiveFlag}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                      {item.completedDate && (
                        <p className="text-[11px] text-slate-400 font-mono">Mastered on {item.completedDate}</p>
                      )}
                    </div>

                    {/* Action */}
                    <div className="shrink-0">
                      {isCurrent ? (
                        <Button
                          variant="primary"
                          size="sm"
                          rightIcon={ArrowRight}
                          onClick={() => navigate('/learn/dsa-mastery/lesson-prefix-sum')}
                        >
                          Continue Learning
                        </Button>
                      ) : isRecommended ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/practice')}
                        >
                          Preview Drills
                        </Button>
                      ) : isCompleted ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate('/practice')}
                        >
                          Review Drills
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">Locked</span>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
