import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { InstructorMetricChart } from '../../components/charts/InstructorMetricChart';
import { TopicAccuracyBarChart } from '../../components/charts/TopicAccuracyBarChart';
import { instructorService } from '../../services/instructorService';
import { Users, Award, TrendingUp, AlertTriangle, BookOpen } from 'lucide-react';

export function StudentAnalytics() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('dsa-mastery');
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    async function load() {
      const c = await instructorService.getMyCourses();
      setCourses(c);
      if (c.length > 0) {
        const a = await instructorService.getCourseAnalytics(selectedCourseId);
        setAnalytics(a);
      }
    }
    load();
  }, [selectedCourseId]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Cohort Analytics & Topic Mastery</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Analyze student engagement drop-offs and cohort-wide weak topics.
          </p>
        </div>

        {/* Course Selector */}
        <div className="w-72">
          <Select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            options={courses.map((c) => ({ value: c.id, label: c.title }))}
          />
        </div>
      </div>

      {analytics && (
        <>
          {/* Top KPI counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 border-slate-200">
              <span className="text-xs font-semibold text-slate-500">Total Enrolled</span>
              <p className="text-2xl font-mono font-bold text-slate-900 mt-1">{analytics.totalEnrolled?.toLocaleString()}</p>
            </Card>
            <Card className="p-5 border-slate-200">
              <span className="text-xs font-semibold text-slate-500">Avg Completion</span>
              <p className="text-2xl font-mono font-bold text-slate-900 mt-1">{analytics.completionRate}%</p>
            </Card>
            <Card className="p-5 border-slate-200">
              <span className="text-xs font-semibold text-slate-500">Avg Quiz Score</span>
              <p className="text-2xl font-mono font-bold text-slate-900 mt-1">{analytics.avgQuizScore}%</p>
            </Card>
            <Card className="p-5 border-slate-200">
              <span className="text-xs font-semibold text-slate-500">Active Learners / Wk</span>
              <p className="text-2xl font-mono font-bold text-slate-900 mt-1">{analytics.activeThisWeek?.toLocaleString()}</p>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-slate-200 shadow-card">
              <CardHeader>
                <CardTitle>Cohort Lesson Drop-off Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <InstructorMetricChart data={analytics.dropoffPoints} height={260} />
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <CardTitle>Cohort Topic Accuracy Breakdown</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <TopicAccuracyBarChart data={analytics.topicAccuracyCohort} height={260} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
