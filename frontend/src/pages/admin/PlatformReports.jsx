import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { adminService } from '../../services/adminService';
import { useToast } from '../../hooks/useToast';
import {
  FileText,
  Download,
  ShieldCheck,
  Activity,
  TrendingUp,
  Brain,
  Zap,
  Clock,
  Sparkles,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export function PlatformReports() {
  const { success: toastSuccess } = useToast();
  const [reportsData, setReportsData] = useState(null);
  const [logFilter, setLogFilter] = useState('all');

  const auditLogs = [
    { action: 'Student diagnostic checkpoint: Prefix Sum (43%)', user: 'Rayudu V.', time: '12 mins ago', type: 'diagnostic', status: 'warning' },
    { action: 'Course publication approved: System Design Architecture', user: 'Dr. Emily Watson', time: '1 hour ago', type: 'course', status: 'success' },
    { action: 'New student account created', user: 'Sophia Laurent', time: '2 hours ago', type: 'user', status: 'info' },
    { action: 'Adaptive difficulty auto-adjusted to Level 3', user: 'AI Engine', time: '4 hours ago', type: 'ai', status: 'purple' },
    { action: 'User status deactivated (Inactive)', user: 'David Kim', time: '1 day ago', type: 'user', status: 'danger' },
    { action: 'Question bank updated: 8 new Subarray problems', user: 'Dr. Emily Watson', time: '2 days ago', type: 'course', status: 'success' },
  ];

  useEffect(() => {
    async function load() {
      const data = await adminService.getPlatformReports();
      setReportsData(data);
    }
    load();
  }, []);

  const handleExportCSV = () => {
    toastSuccess('Report Exported', 'CSV summary downloaded with user analytics & course completion data.');
  };

  const filteredLogs = auditLogs.filter((log) => {
    if (logFilter === 'all') return true;
    return log.type === logFilter;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="purple" size="sm">
              Platform Intelligence
            </Badge>
            <span className="text-xs text-slate-500 font-mono">Real-time Telemetry & Diagnostics</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Platform Reports & Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Topic accuracy distributions, system audit logs, learner engagement metrics, and accreditation exports.
          </p>
        </div>

        <Button
          variant="outline"
          size="md"
          leftIcon={Download}
          onClick={handleExportCSV}
          className="border-slate-300 hover:bg-slate-50 font-semibold self-start sm:self-auto"
        >
          Export Compliance CSV
        </Button>
      </div>

      {/* Engagement Telemetry Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Daily AI Queries</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Brain className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-mono font-bold text-purple-700 mt-2">1,420</p>
          <span className="text-[11px] text-slate-400">Interactive tutor sessions</span>
        </Card>

        <Card className="p-4 border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Avg. Study Duration</span>
            <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-mono font-bold text-brand-700 mt-2">42 mins</p>
          <span className="text-[11px] text-slate-400">Daily average per learner</span>
        </Card>

        <Card className="p-4 border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Quiz Completion Rate</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-mono font-bold text-emerald-700 mt-2">81.4%</p>
          <span className="text-[11px] text-emerald-600 font-medium">+4.2% vs last month</span>
        </Card>

        <Card className="p-4 border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Streak Average</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-mono font-bold text-amber-700 mt-2">8.6 days</p>
          <span className="text-[11px] text-slate-400">Consistent retention</span>
        </Card>
      </div>

      {/* Two-Column Analytics Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Diagnostic Accuracy Health */}
        <Card className="border-slate-200 shadow-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Institution Topic Mastery Spectrum</h3>
              <p className="text-xs text-slate-500">Aggregated diagnostic quiz performance across all students</p>
            </div>
            <Badge variant="purple" size="sm">Adaptive Telemetry</Badge>
          </div>

          <div className="space-y-3.5">
            {reportsData?.topicAccuracyDistribution?.map((item) => (
              <div key={item.topic} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800">{item.topic}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">({item.students.toLocaleString()} students)</span>
                    <span
                      className={cn(
                        'font-bold font-mono',
                        item.accuracy >= 75
                          ? 'text-emerald-600'
                          : item.accuracy >= 55
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      )}
                    >
                      {item.accuracy}%
                    </span>
                  </div>
                </div>
                <ProgressBar
                  value={item.accuracy}
                  size="sm"
                  color={item.accuracy >= 75 ? 'success' : item.accuracy >= 55 ? 'warning' : 'danger'}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Monthly Enrollment Growth */}
        <Card className="border-slate-200 shadow-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Enrollments & Completions Trend</h3>
              <p className="text-xs text-slate-500">Platform subscription trajectory (2026 Q1 - Q3)</p>
            </div>
            <Badge variant="success" size="sm">+38% YoY</Badge>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-64 flex items-end justify-between gap-2 pt-6 px-2">
            {reportsData?.monthlyEnrollments?.map((m) => {
              const maxEnroll = 7000;
              const heightPercent = Math.round((m.enrollments / maxEnroll) * 100);
              const compPercent = Math.round((m.completions / maxEnroll) * 100);

              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1 h-44">
                    {/* Enrollments Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-1/2 bg-purple-500 rounded-t-md group-hover:bg-purple-600 transition-all relative"
                      title={`${m.enrollments} enrollments in ${m.month}`}
                    />
                    {/* Completions Bar */}
                    <div
                      style={{ height: `${compPercent}%` }}
                      className="w-1/2 bg-emerald-400 rounded-t-md group-hover:bg-emerald-500 transition-all relative"
                      title={`${m.completions} completions in ${m.month}`}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 font-mono">{m.month}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 text-xs border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-purple-500 inline-block" />
              <span className="text-slate-600 font-medium">New Enrollments</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-400 inline-block" />
              <span className="text-slate-600 font-medium">Course Completions</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Audit Log Stream */}
      <Card className="border-slate-200 shadow-card">
        <CardHeader className="border-b border-slate-100 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">Governance & Audit Event Log</CardTitle>
              <p className="text-xs text-slate-500">Immutable administrative tracking of user permission and course lifecycle changes</p>
            </div>

            {/* Filter Log Pills */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
              {[
                { id: 'all', label: 'All Events' },
                { id: 'user', label: 'User Changes' },
                { id: 'course', label: 'Course Events' },
                { id: 'diagnostic', label: 'Diagnostics' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setLogFilter(pill.id)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg transition-all',
                    logFilter === pill.id
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="divide-y divide-slate-100 p-0">
          {filteredLogs.map((log, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50/60 transition-colors">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'p-2 rounded-xl shrink-0',
                    log.status === 'success'
                      ? 'bg-emerald-50 text-emerald-600'
                      : log.status === 'warning'
                      ? 'bg-amber-50 text-amber-600'
                      : log.status === 'danger'
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-purple-50 text-purple-600'
                  )}
                >
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{log.action}</p>
                  <p className="text-[11px] text-slate-400">Actor / Target: {log.user}</p>
                </div>
              </div>

              <span className="font-mono text-slate-400 text-xs shrink-0">{log.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
