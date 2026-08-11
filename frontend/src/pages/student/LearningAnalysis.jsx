import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { TopicAccuracyBarChart } from '../../components/charts/TopicAccuracyBarChart';
import { useAdaptiveEngine } from '../../hooks/useAdaptiveEngine';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Target,
  BarChart3,
  Award,
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';

export function LearningAnalysis() {
  const { topicMastery, weakTopics, strongTopics, practiceTopics, overallMastery } = useAdaptiveEngine();
  const navigate = useNavigate();

  // Recommended Next Steps derived dynamically
  const recommendedNextSteps = [
    {
      step: 1,
      title: 'Review Prefix Sum fundamentals',
      topic: 'Prefix Sum',
      type: 'Revision',
      desc: 'Address off-by-one errors and review immutable range subtraction principles.',
      actionText: 'Review Lesson',
      actionLink: '/learn/dsa-mastery/lesson-prefix-sum',
      icon: BookOpen,
      color: 'rose',
    },
    {
      step: 2,
      title: 'Practice 3 easy Prefix Sum problems',
      topic: 'Prefix Sum',
      type: 'Practice Drills',
      desc: 'Build instinctive pattern recognition with targeted short drills.',
      actionText: 'Practice Now',
      actionLink: '/practice?topic=prefix-sum',
      icon: Target,
      color: 'amber',
    },
    {
      step: 3,
      title: 'Attempt HashMap lookup & frequency practice',
      topic: 'HashMap & Sets',
      type: 'Practice Drills',
      desc: 'Elevate your 52% accuracy in hash lookups before moving to sliding windows.',
      actionText: 'Start Drill',
      actionLink: '/practice?topic=hashmap',
      icon: Target,
      color: 'amber',
    },
    {
      step: 4,
      title: 'Retake Diagnostic Assessment',
      topic: 'DSA Core',
      type: 'Assessment',
      desc: 'Re-evaluate your updated mastery profile to unlock advanced tree algorithms.',
      actionText: 'Retake Assessment',
      actionLink: '/quiz/quiz-prefix-sum',
      icon: RotateCcw,
      color: 'brand',
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-card space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="purple" size="sm">
                Adaptive Diagnosis
              </Badge>
              <span className="text-xs text-slate-500 font-mono">Live Recalibrated</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Adaptive Learning Analysis</h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              SkillForage continuously evaluates your quiz accuracy, time per question, and retry attempts to classify topic proficiencies and synthesize high-yield next steps.
            </p>
          </div>

          {/* Overall Mastery Ring KPI */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-4 shrink-0">
            <div className="w-14 h-14 rounded-full bg-brand-600 text-white flex flex-col items-center justify-center font-mono font-bold text-lg shadow-xs">
              <span>{overallMastery}%</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900">Overall Mastery</span>
              <p className="text-[11px] text-slate-500">Across 8 evaluated topics</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Core Categorization Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Strong Topics */}
        <Card className="border-emerald-200 bg-emerald-50/20 shadow-xs">
          <CardHeader className="bg-emerald-50/60 border-b border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Strong Topics (≥ 80%)</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            {strongTopics.map((t) => (
              <div key={t.id || t.topic} className="p-3 bg-white rounded-lg border border-emerald-200/80 shadow-2xs space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                  <span>{t.topic}</span>
                  <span className="font-mono text-emerald-600">{t.accuracy}%</span>
                </div>
                <ProgressBar value={t.accuracy} size="sm" color="emerald" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Topics Needing Practice */}
        <Card className="border-amber-200 bg-amber-50/20 shadow-xs">
          <CardHeader className="bg-amber-50/60 border-b border-amber-100">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Topics Needing Practice (60-79%)</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            {practiceTopics.map((t) => (
              <div key={t.id || t.topic} className="p-3 bg-white rounded-lg border border-amber-200/80 shadow-2xs space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                  <span>{t.topic}</span>
                  <span className="font-mono text-amber-600">{t.accuracy}%</span>
                </div>
                <ProgressBar value={t.accuracy} size="sm" color="amber" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Topics Needing Revision */}
        <Card className="border-rose-200 bg-rose-50/20 shadow-xs">
          <CardHeader className="bg-rose-50/60 border-b border-rose-100">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Topics Needing Revision (&lt; 60%)</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            {weakTopics.map((t) => (
              <div key={t.id || t.topic} className="p-3 bg-white rounded-lg border border-rose-200/80 shadow-2xs space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                  <span>{t.topic}</span>
                  <span className="font-mono text-rose-600">{t.accuracy}%</span>
                </div>
                <ProgressBar value={t.accuracy} size="sm" color="rose" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Visual Topic Accuracy Bar Chart */}
      <Card className="border-slate-200/90 shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-600" />
              <CardTitle>Topic Accuracy Spectrum</CardTitle>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Mastered (≥80%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Practice (60-79%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Revision (&lt;60%)
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <TopicAccuracyBarChart data={topicMastery} height={300} />
        </CardContent>
      </Card>

      {/* Recommended Next Steps Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Recommended Next Steps
            </h2>
            <p className="text-xs text-slate-500">
              Generated automatically from your individual topic performance and assessment errors.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedNextSteps.map((step) => {
            const Icon = step.icon;

            return (
              <Card key={step.step} className="p-5 border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-700 font-mono font-bold text-xs flex items-center justify-center border border-brand-200">
                      {step.step}
                    </span>
                    <Badge variant={step.color === 'rose' ? 'danger' : step.color === 'amber' ? 'warning' : 'primary'} size="sm">
                      {step.type}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    rightIcon={ArrowRight}
                    onClick={() => navigate(step.actionLink)}
                  >
                    {step.actionText}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
