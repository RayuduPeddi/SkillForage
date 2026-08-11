import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { HelpCircle, PlayCircle, Target, Bot, Clock } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

export function RecentActivityList({ activities = [] }) {
  const getIcon = (type) => {
    switch (type) {
      case 'quiz':
        return { icon: HelpCircle, bg: 'bg-amber-100 text-amber-700' };
      case 'lesson':
        return { icon: PlayCircle, bg: 'bg-brand-100 text-brand-700' };
      case 'practice':
        return { icon: Target, bg: 'bg-emerald-100 text-emerald-700' };
      case 'ai':
        return { icon: Bot, bg: 'bg-purple-100 text-purple-700' };
      default:
        return { icon: Clock, bg: 'bg-slate-100 text-slate-700' };
    }
  };

  return (
    <Card className="border-slate-200/90 shadow-card">
      <CardHeader>
        <CardTitle>Recent Learning Activity</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-slate-100">
          {activities.slice(0, 5).map((act) => {
            const { icon: Icon, bg } = getIcon(act.type);

            return (
              <div key={act.id} className="p-4 flex items-start justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`p-2 rounded-lg shrink-0 ${bg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">{act.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{act.detail}</p>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                  {formatRelativeTime(act.timestamp)}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
