import React, { useEffect } from 'react';
import { CourseCard } from '../../components/course/CourseCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses } from '../../store/slices/courseSlice';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Compass } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

export function MyLearning() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enrolledCourses, isLoading } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">My Learning</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Track and resume your active courses and adaptive curriculum modules.
        </p>
      </div>

      {enrolledCourses && enrolledCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No courses enrolled yet"
          description="Explore our curriculum to start learning with adaptive AI feedback."
          actionLabel="Explore Courses"
          onAction={() => navigate(ROUTES.COURSES)}
        />
      )}
    </div>
  );
}
