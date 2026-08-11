import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { adminService } from '../../services/adminService';
import { useToast } from '../../hooks/useToast';
import {
  Users,
  BookOpen,
  Shield,
  Presentation,
  GraduationCap,
  Activity,
  Award,
  ArrowRight,
  Plus,
  Power,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { cn } from '../../utils/cn';
import { getAutoCourseThumbnail } from '../../utils/courseThumbnails';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { success: toastSuccess, error: toastError } = useToast();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      toastError('Failed to load dashboard metrics', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleToggleUserStatus = async (user) => {
    try {
      const updated = await adminService.toggleUserStatus(user.id);
      toastSuccess('User Status Changed', `${user.name} is now ${updated.status === 'active' ? 'Active' : 'Inactive'}.`);
      loadStats();
    } catch (err) {
      toastError('Status Update Failed', err.message);
    }
  };

  const handleToggleCourseStatus = async (course) => {
    try {
      const updated = await adminService.toggleCourseStatus(course.id);
      toastSuccess('Course Status Changed', `"${course.title}" is now ${updated.status === 'active' ? 'Active' : 'Inactive'}.`);
      loadStats();
    } catch (err) {
      toastError('Status Update Failed', err.message);
    }
  };

  if (!stats && isLoading) {
    return (
      <div className="py-20 text-center text-slate-400 text-sm">
        Loading administrator dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="purple" size="sm">
              Admin Governance Center
            </Badge>
            <span className="text-xs text-slate-500 font-mono">SkillForage Platform Controller</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Platform Command Center</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            System overview, user permissions governance, course catalogue moderation, and live learning metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.ADMIN_COURSES)}
          >
            Moderate Courses
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(ROUTES.ADMIN_USERS)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold"
          >
            Manage All Users
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card className="p-5 border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Accounts</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-mono font-bold text-slate-900 mt-2">{stats.totalUsers}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            {stats.activeStudents} active students
          </p>
        </Card>

        {/* Instructors */}
        <Card className="p-5 border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Instructors</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Presentation className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-mono font-bold text-amber-700 mt-2">{stats.instructors}</p>
          <p className="text-[11px] text-slate-400 mt-1">Verified curriculum faculty</p>
        </Card>

        {/* Courses & Active */}
        <Card className="p-5 border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Courses Catalogue</span>
            <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-mono font-bold text-slate-900 mt-2">{stats.totalCourses}</p>
          <p className="text-[11px] text-brand-600 font-medium mt-1">
            {stats.activeCourses} active / live courses
          </p>
        </Card>

        {/* Enrollments & Completion */}
        <Card className="p-5 border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Enrollments</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-mono font-bold text-slate-900 mt-2">{stats.totalEnrollments.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">{stats.platformCompletionRate}% completion rate</p>
        </Card>
      </div>

      {/* Two Column Section: Live Users & Live Courses Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: User Directory Snapshot */}
        <Card className="border-slate-200 shadow-card">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <CardTitle className="text-base font-bold text-slate-900">Recent Users</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                rightIcon={ArrowRight}
                onClick={() => navigate(ROUTES.ADMIN_USERS)}
                className="text-xs font-semibold text-purple-700"
              >
                Manage All ({stats.totalUsers})
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {stats.usersList?.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={u.name} size="sm" />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{u.name}</p>
                          <p className="text-slate-400 text-[10px] truncate max-w-[120px]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge
                        variant={u.role === 'admin' ? 'purple' : u.role === 'instructor' ? 'warning' : 'primary'}
                        size="sm"
                        className="capitalize text-[10px]"
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold',
                          u.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        )}
                      >
                        {u.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleUserStatus(u)}
                        className={cn(
                          'p-1.5 rounded-lg transition-colors',
                          u.status === 'active'
                            ? 'text-amber-600 hover:bg-amber-50'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        )}
                        title="Toggle Active/Inactive"
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Right: Course Catalogue Snapshot */}
        <Card className="border-slate-200 shadow-card">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-600" />
                <CardTitle className="text-base font-bold text-slate-900">Courses Snapshot</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                rightIcon={ArrowRight}
                onClick={() => navigate(ROUTES.ADMIN_COURSES)}
                className="text-xs font-semibold text-brand-700"
              >
                Moderate All ({stats.totalCourses})
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">Course</th>
                  <th className="px-5 py-3">Domain</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {stats.coursesList?.map((c) => {
                  const isActive = (c.status || 'active') === 'active';
                  const thumb = c.thumbnail || getAutoCourseThumbnail(c.category, c.title);

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={thumb}
                            alt={c.title}
                            className="w-10 h-7 object-cover rounded shrink-0 border border-slate-200"
                          />
                          <p className="font-bold text-slate-900 truncate max-w-[140px]">{c.title}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[10px] font-semibold text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded">
                          {c.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold',
                            isActive
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          )}
                        >
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleCourseStatus(c)}
                          className={cn(
                            'p-1.5 rounded-lg transition-colors',
                            isActive
                              ? 'text-amber-600 hover:bg-amber-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          )}
                          title="Toggle Active/Inactive"
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
