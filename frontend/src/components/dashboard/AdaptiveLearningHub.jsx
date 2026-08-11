import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { Modal } from '../ui/Modal';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  Target,
  Brain,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Flame,
  Layers,
  Sliders,
  RotateCcw,
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';

export function AdaptiveLearningHub({
  overallMastery = 72,
  weakTopics = [],
  strongTopics = [],
  recommendations = [],
  streak = 14,
}) {
  const navigate = useNavigate();
  const [selectedPace, setSelectedPace] = useState('balanced'); // 'gentle' | 'balanced' | 'accelerated'
  const [activeRationaleTopic, setActiveRationaleTopic] = useState(null);

  const topicRationales = {
    'Prefix Sum': {
      accuracy: 43,
      triggers: [
        '2 incorrect answers in Diagnostic Quiz #2 regarding range subtraction L=0 boundary.',
        'Average response latency: 45s (indicates conceptual hesitation on immutable arrays).',
        'Direct prerequisite for Sliding Window and 2D Range Queries.',
      ],
      prescribedAction: 'Complete 3 targeted 1D prefix sum exercises and review 0-index offset rules.',
      actionLink: '/learn/dsa-mastery/lesson-prefix-sum',
    },
    'HashMap & Sets': {
      accuracy: 52,
      triggers: [
        'Struggled with frequency count lookup collision handling in Module 3 quiz.',
        'Required for solving Two-Sum & Subarray Sum Equals K in O(N) time.',
      ],
      prescribedAction: 'Reinforce HashMap key lookup patterns in the Practice Hub.',
      actionLink: '/practice?topic=hashmap',
    },
    'Binary Search': {
      accuracy: 45,
      triggers: [
        'Off-by-one errors in while (low <= high) boundary termination condition.',
      ],
      prescribedAction: 'Run AI Mentor code proof simulation on rotated array search.',
      actionLink: '/ai-mentor',
    },
  };

  return (
    <Card className="border-brand-200 bg-gradient-to-br from-brand-50/50 via-purple-50/30 to-white shadow-card overflow-hidden">
      {/* Top Banner Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-brand-600 via-purple-600 to-indigo-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xs">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight">Adaptive Learning Command Center</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400 text-emerald-950 uppercase tracking-wider">
                Live Engine
              </span>
            </div>
            <p className="text-xs text-white/80">
              Dynamically recalculating your syllabus based on real-time quiz performance and cognitive gaps.
            </p>
          </div>
        </div>

        {/* Dynamic Difficulty Level Meter */}
        <div className="flex items-center gap-3 bg-black/25 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/15 shrink-0">
          <Zap className="w-5 h-5 text-amber-300" />
          <div>
            <span className="text-xs uppercase font-bold text-white/80 block tracking-wider">Dynamic Level</span>
            <span className="text-sm font-bold text-white">Tier 2 • Intermediate</span>
          </div>
        </div>
      </div>

      <CardContent className="p-6 sm:p-8 space-y-6">
        {/* Adaptive KPI Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Live Mastery */}
          <div className="p-5 rounded-2xl border border-slate-200/90 bg-white space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between text-sm text-slate-500 font-medium">
              <span>Cognitive Mastery</span>
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-mono font-bold text-slate-900">{overallMastery}%</span>
              <span className="text-sm font-bold text-emerald-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-0.5" /> +14%
              </span>
            </div>
            <ProgressBar value={overallMastery} size="sm" color="brand" />
          </div>

          {/* Card 2: Weak Area Remediation */}
          <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/40 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between text-sm text-rose-700 font-bold">
              <span>Active Weak Focus</span>
              <AlertCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-slate-900">Prefix Sum</span>
              <Badge variant="danger" size="sm">43% Score</Badge>
            </div>
            <p className="text-xs text-slate-600 leading-snug">
              Remediation drills queued to repair range subtraction misconceptions.
            </p>
          </div>

          {/* Card 3: Adaptive Pace */}
          <div className="p-5 rounded-2xl border border-slate-200/90 bg-white space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between text-sm text-slate-500 font-medium">
              <span>Adaptive Pacing</span>
              <Sliders className="w-4 h-4 text-brand-600" />
            </div>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'gentle', label: 'Gentle' },
                { id: 'balanced', label: 'Balanced' },
                { id: 'accelerated', label: 'Fast' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPace(p.id)}
                  className={`flex-1 py-1.5 px-2 text-xs rounded-xl font-bold transition-all ${
                    selectedPace === p.id
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              {selectedPace === 'gentle' ? 'Reinforces concepts with extra hints' : selectedPace === 'balanced' ? 'Optimal balance of theory & drills' : 'Fast-track to advanced topics'}
            </p>
          </div>

          {/* Card 4: Retention Streak */}
          <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between text-sm text-amber-800 font-bold">
              <span>Spaced Repetition</span>
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-mono font-bold text-slate-900">{streak}</span>
              <span className="text-sm text-slate-600 font-semibold">Days Streak</span>
            </div>
            <p className="text-xs text-slate-600">
              Next scheduled memory refresh in <span className="font-bold text-slate-900">18 hours</span>.
            </p>
          </div>
        </div>

        {/* Adaptive Remediation Queue & Why It Matters */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600" />
              Targeted Remediation Queue (AI Diagnostics)
            </h3>
            <span className="text-sm text-purple-700 font-bold cursor-pointer hover:underline" onClick={() => navigate(ROUTES.LEARNING_PATH)}>
              View Full Adaptive Path →
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {weakTopics.slice(0, 3).map((topic) => (
              <div
                key={topic.id || topic.topic}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-brand-500 transition-all space-y-3.5 shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">{topic.topic}</span>
                    <Badge variant="danger" size="sm">
                      {topic.accuracy}% Accuracy
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Identified conceptual confusion during recent diagnostic tests.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1 text-xs font-semibold"
                    onClick={() => navigate(`/practice?topic=${topic.id || topic.topic.toLowerCase()}`)}
                  >
                    Start Drill
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs font-semibold text-purple-700 border-purple-200 hover:bg-purple-50"
                    onClick={() => setActiveRationaleTopic(topic.topic)}
                    title="Why is this recommended?"
                  >
                    Why?
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      {/* Rationale Modal */}
      <Modal
        isOpen={Boolean(activeRationaleTopic)}
        onClose={() => setActiveRationaleTopic(null)}
        title={`Adaptive Rationale: ${activeRationaleTopic}`}
        size="md"
      >
        {activeRationaleTopic && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 leading-relaxed">
              SkillForage's adaptive algorithm flagged <strong className="text-slate-900">{activeRationaleTopic}</strong> because of specific performance signals during your recent quizzes.
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Diagnostic Triggers Detected:
              </h4>
              <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-700">
                {(topicRationales[activeRationaleTopic]?.triggers || [
                  'Quiz accuracy scored below the 60% mastery threshold.',
                  'Identified prerequisite gap for upcoming algorithm modules.',
                  'Targeted remediation recommended to prevent cascading errors.',
                ]).map((trigger, idx) => (
                  <li key={idx} className="leading-relaxed">{trigger}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Prescribed Next Action:
              </span>
              <p className="text-xs font-semibold text-slate-800">
                {topicRationales[activeRationaleTopic]?.prescribedAction || 'Take a 5-minute targeted revision drill.'}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveRationaleTopic(null);
                  navigate('/ai-mentor');
                }}
              >
                Ask AI Mentor
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const link = topicRationales[activeRationaleTopic]?.actionLink || '/practice';
                  setActiveRationaleTopic(null);
                  navigate(link);
                }}
              >
                Take Prescribed Drill →
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
}
