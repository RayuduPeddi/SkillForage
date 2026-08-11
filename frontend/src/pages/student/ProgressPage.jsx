import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { TopicAccuracyBarChart } from '../../components/charts/TopicAccuracyBarChart';
import { MasteryRadarChart } from '../../components/charts/MasteryRadarChart';
import { WeeklyStreakChart } from '../../components/charts/WeeklyStreakChart';
import { CourseProgressLineChart } from '../../components/charts/CourseProgressLineChart';
import { ProgressSummaryCard } from '../../components/dashboard/ProgressSummaryCard';
import { LoadingState } from '../../components/ui/LoadingState';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProgress } from '../../store/slices/progressSlice';
import { TrendingUp, BarChart2, Award, Calendar, Activity } from 'lucide-react';

export function ProgressPage() {
  const dispatch = useDispatch();
  const { progressData, isLoading } = useSelector((state) => state.progress);

  useEffect(() => {
    dispatch(fetchProgress());
  }, [dispatch]);

  if (isLoading || !progressData) {
    return <LoadingState message="Loading your comprehensive learning analytics..." />;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Learning Progress & Analytics</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Detailed metrics tracking your topic mastery, diagnostic quiz trends, and study consistency.
        </p>
      </div>

      {/* KPI Counters */}
      <ProgressSummaryCard
        overallMastery={progressData.overallMastery}
        quizAccuracy={progressData.averageQuizAccuracy}
        masteredCount={progressData.masteredTopicsCount}
        streak={progressData.streakDays}
      />

      {/* Charts Grid: Row 1 - Topic Accuracy & Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-7 border-slate-200 shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-brand-600" />
              <CardTitle>Topic Accuracy Breakdown</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <TopicAccuracyBarChart data={progressData.topicMastery} height={300} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-5 border-slate-200 shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              <CardTitle>Mastery Radar</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <MasteryRadarChart data={progressData.topicMastery} height={300} />
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid: Row 2 - Weekly Activity & Quiz Score Trajectory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <CardTitle>Weekly Learning Consistency (Hours)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <WeeklyStreakChart data={progressData.weeklyActivity} height={250} />
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              <CardTitle>Quiz Performance Trajectory</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CourseProgressLineChart data={progressData.quizScoreHistory} height={250} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
