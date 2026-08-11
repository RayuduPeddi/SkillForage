import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { instructorService } from '../../services/instructorService';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit3, Trash2, Eye, BarChart2, Star } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { useToast } from '../../hooks/useToast';

export function InstructorCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const { success: toastSuccess } = useToast();

  useEffect(() => {
    async function load() {
      const data = await instructorService.getMyCourses();
      setCourses(data);
    }
    load();
  }, []);

  const handleDelete = async (courseId) => {
    await instructorService.deleteCourse(courseId);
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    toastSuccess('Course Deleted', 'The course was removed from your catalog.');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">My Instructor Courses</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage your courses, edit curriculum modules, and configure diagnostic quizzes.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={PlusCircle}
          onClick={() => navigate(ROUTES.INSTRUCTOR_COURSE_BUILDER)}
        >
          Create Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="border-slate-200 flex flex-col justify-between shadow-card hover:border-slate-300 transition-all">
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="primary" size="sm">
                  {course.category}
                </Badge>
                <Badge variant="success" size="sm">
                  Published
                </Badge>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 leading-snug">{course.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{course.description || course.subtitle}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{course.studentsEnrolled?.toLocaleString()} Students</span>
                <span className="flex items-center gap-1 text-amber-600 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {course.rating || 4.9}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={BarChart2}
                onClick={() => navigate(`/instructor/analytics?courseId=${course.id}`)}
              >
                Analytics
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={Eye}
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-rose-600 hover:bg-rose-50"
                  onClick={() => handleDelete(course.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
