import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { instructorService } from '../../services/instructorService';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  PlusCircle,
  BarChart3,
  Award,
  ArrowRight,
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';

export function InstructorDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function loadData() {
      const s = await instructorService.getDashboardStats();
      const c = await instructorService.getMyCourses();
      setStats(s);
      setCourses(c);
    }
    loadData();
  }, []);

  if (!stats) return null;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Badge variant="purple" size="sm">
            Instructor Portal
          </Badge>
          <h1 className="text-2xl font-bold text-slate-900">Instructor Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor student cohorts, course completions, and cohort topic weaknesses.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={PlusCircle}
          onClick={() => navigate(ROUTES.INSTRUCTOR_COURSE_BUILDER)}
        >
          Create New Course
        </Button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Total Students</span>
            <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900">{stats.totalStudents?.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">↑ 14% this month</p>
        </Card>

        <Card className="p-5 border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Published Courses</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900">{stats.publishedCourses}</p>
          <p className="text-[11px] text-slate-400 mt-1">{stats.draftCourses} draft courses</p>
        </Card>

        <Card className="p-5 border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Avg Completion</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900">{stats.averageCompletionRate}%</p>
          <p className="text-[11px] text-slate-400 mt-1">Above platform average</p>
        </Card>

        <Card className="p-5 border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Avg Quiz Score</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900">{stats.averageQuizScore}%</p>
          <p className="text-[11px] text-slate-400 mt-1">Diagnostic quizzes</p>
        </Card>
      </div>

      {/* Cohort Insight & Recent Enrollments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Courses List */}
        <Card className="lg:col-span-7 border-slate-200 shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <CardTitle>My Courses</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.INSTRUCTOR_COURSES)}
              >
                View All
              </Button>
            </div>
          </CardHeader>

          <CardContent className="divide-y divide-slate-100 p-0">
            {courses.slice(0, 3).map((c) => (
              <div key={c.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                <div className="space-y-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{c.title}</h4>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>{c.studentsEnrolled?.toLocaleString()} students</span>
                    <span>•</span>
                    <span>★ {c.rating}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/instructor/analytics?courseId=${c.id}`)}
                >
                  Analytics
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Enrollments */}
        <Card className="lg:col-span-5 border-slate-200 shadow-card">
          <CardHeader>
            <CardTitle>Recent Student Activity</CardTitle>
          </CardHeader>

          <CardContent className="divide-y divide-slate-100 p-0">
            {stats.recentEnrollments?.map((enr) => (
              <div key={enr.id} className="p-4 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-900">{enr.studentName}</span>
                  <span className="font-mono text-brand-600 font-semibold">{enr.progress}% progress</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">{enr.courseName}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
