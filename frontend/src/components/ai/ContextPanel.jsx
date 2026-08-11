import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Sparkles, AlertCircle, BookOpen, Award, CheckCircle, Target, Brain, SlidersHorizontal } from 'lucide-react';

export function ContextPanel({
  overallMastery = 72,
  weakTopics = [],
  strongTopics = [],
  currentCourse = 'Data Structures & Algorithms',
  currentTopic = 'Prefix Sum',
  onSelectTopic,
}) {
  return (
    <Card className="border-slate-200 shadow-card space-y-4">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <CardTitle>Adaptive AI Context</CardTitle>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            Live
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        <p className="text-xs text-slate-500 leading-relaxed">
          The AI Mentor automatically tailors its responses to your diagnostic scores and weak concepts. Click any topic below to switch focus.
        </p>

        {/* Current Course & Focus */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Active Focus Topic:</span>
            <span className="font-bold text-purple-700">{currentTopic}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Mastery Level:</span>
            <span className="font-mono font-bold text-brand-600">{overallMastery}%</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Adaptive Challenge:</span>
            <span className="font-semibold text-emerald-600">Level 2 • Remediation</span>
          </div>
        </div>

        {/* Weak Topics */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Detected Weak Topics (Click to Target)
          </span>
          <div className="flex flex-wrap gap-1.5">
            {weakTopics.length > 0 ? (
              weakTopics.map((t) => (
                <button
                  key={t.id || t.topic}
                  type="button"
                  onClick={() => onSelectTopic?.(t.topic)}
                  className="cursor-pointer hover:scale-105 transition-transform"
                >
                  <Badge variant="danger" size="sm">
                    {t.topic} ({t.accuracy}%)
                  </Badge>
                </button>
              ))
            ) : (
              <span className="text-xs text-slate-400">No critical weak spots detected</span>
            )}
          </div>
        </div>

        {/* Strong Topics */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            Mastered Concepts
          </span>
          <div className="flex flex-wrap gap-1.5">
            {strongTopics.map((t) => (
              <button
                key={t.id || t.topic}
                type="button"
                onClick={() => onSelectTopic?.(t.topic)}
                className="cursor-pointer hover:scale-105 transition-transform"
              >
                <Badge variant="success" size="sm">
                  {t.topic} ({t.accuracy}%)
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Tip */}
        <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200/80 text-[11px] text-purple-900 leading-snug space-y-1">
          <div className="font-bold flex items-center gap-1">
            <Brain className="w-3.5 h-3.5 text-purple-600" />
            Adaptive Tip:
          </div>
          <p className="text-purple-800">
            Ask for mathematical proofs or edge-case walkthroughs to convert 43% Prefix Sum into permanent mastery.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
