import React from 'react';
import { Sparkles, Flame, Target } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function WelcomeBanner() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.name ? user.name.split(' ')[0] : 'Learner';

  return (
    <div className="bg-gradient-to-r from-brand-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-card border border-brand-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-2 max-w-xl">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-800/80 text-brand-200 text-xs font-semibold border border-brand-700/50">
          <Sparkles className="w-3.5 h-3.5 text-brand-300" />
          <span>Adaptive Path Active</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-white">
          {getGreeting()}, {firstName}
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Your learning curriculum has recalibrated based on your latest diagnostic results. Focus on high-impact weak topics today to maximize mastery.
        </p>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 shrink-0">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-xs text-amber-300 font-semibold">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Streak</span>
          </div>
          <p className="text-lg font-mono font-bold text-white">{user?.streak || 14} Days</p>
        </div>

        <div className="h-8 w-px bg-white/20 hidden sm:block" />

        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-xs text-brand-200 font-semibold">
            <Target className="w-4 h-4 text-brand-300" />
            <span>Target Goal</span>
          </div>
          <p className="text-xs font-medium text-slate-200 max-w-[9rem] truncate">
            {user?.learningGoal || 'Software Engineer Prep'}
          </p>
        </div>
      </div>
    </div>
  );
}
