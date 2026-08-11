import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { GitFork, CheckCircle2, Circle, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export function LearningPathProgress({ path = [] }) {
  const displayItems = path.slice(0, 5);

  return (
    <Card className="border-slate-200/90 shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <GitFork className="w-4 h-4 text-brand-600" />
            <CardTitle>Personalized Learning Path</CardTitle>
          </div>
          <Link
            to={ROUTES.LEARNING_PATH}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            Full Path <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {displayItems.map((item, idx) => {
            const isCompleted = item.status === 'completed';
            const isCurrent = item.status === 'current';
            const isRecommended = item.status === 'recommended';

            return (
              <div key={item.id || idx} className="relative group">
                {/* Node icon */}
                <div
                  className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white ${
                    isCompleted
                      ? 'bg-emerald-500'
                      : isCurrent
                      ? 'bg-brand-600 ring-4 ring-brand-100'
                      : isRecommended
                      ? 'bg-purple-600 ring-4 ring-purple-100'
                      : 'bg-slate-300'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>

                {/* Content */}
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold ${
                          isCurrent ? 'text-brand-900' : isCompleted ? 'text-slate-700' : 'text-slate-500'
                        }`}
                      >
                        {item.topic}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] font-mono text-emerald-600 font-semibold">✓ {item.accuracy}%</span>
                      )}
                      {isCurrent && (
                        <Badge variant="primary" size="sm">
                          ● Current
                        </Badge>
                      )}
                      {isRecommended && (
                        <Badge variant="purple" size="sm">
                          → Recommended Next
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{item.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
