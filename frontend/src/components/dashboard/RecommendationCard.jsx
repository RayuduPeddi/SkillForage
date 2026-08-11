import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Sparkles, ArrowRight, BookOpen, Target, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function RecommendationCard({ recommendation }) {
  const navigate = useNavigate();

  if (!recommendation) {
    return (
      <Card className="border-brand-200 bg-brand-50/30">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-100 text-brand-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">AI Adaptive System</h4>
              <p className="text-xs text-slate-500">Take a quiz to generate new personalized learning recommendations.</p>
            </div>
          </div>
          <Button size="sm" onClick={() => navigate('/practice')}>
            Practice Now
          </Button>
        </CardContent>
      </Card>
    );
  }

  const icons = {
    revision: BookOpen,
    practice: Target,
    quiz: HelpCircle,
  };

  const Icon = icons[recommendation.type] || Sparkles;

  return (
    <Card className="border-brand-200 bg-gradient-to-r from-brand-50/60 to-white shadow-card">
      <CardContent className="p-5 sm:p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-brand-600 text-white shrink-0 shadow-xs">
              <Icon className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="purple" size="sm">
                  AI Recommendation
                </Badge>
                <span className="text-xs font-mono font-semibold text-slate-500">
                  Topic: {recommendation.topic}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {recommendation.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {recommendation.reason}
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            rightIcon={ArrowRight}
            onClick={() => navigate(recommendation.actionLink || '/practice')}
            className="shrink-0"
          >
            {recommendation.actionText || 'Take Action'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
