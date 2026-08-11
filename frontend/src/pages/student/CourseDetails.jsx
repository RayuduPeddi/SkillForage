import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { ModuleAccordion } from '../../components/course/ModuleAccordion';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourseById, enrollInCourse } from '../../store/slices/courseSlice';
import { useToast } from '../../hooks/useToast';
import {
  Star,
  Clock,
  BookOpen,
  User,
  CheckCircle2,
  PlayCircle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export function CourseDetails() {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentCourse: course, isLoading, error } = useSelector((state) => state.courses);
  const { success: toastSuccess } = useToast();

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseById(courseId));
    }
  }, [dispatch, courseId]);

  const handleEnrollOrContinue = async () => {
    if (!course) return;
    if (course.isEnrolled) {
      navigate(`/learn/${course.id}/${course.currentLessonId || 'lesson-1'}`);
    } else {
      await dispatch(enrollInCourse(course.id));
      toastSuccess('Enrolled!', `You are now enrolled in ${course.title}.`);
      navigate(`/learn/${course.id}/lesson-1`);
    }
  };

  if (isLoading || !course) {
    return <LoadingState message="Loading course curriculum..." />;
  }

  if (error) {
    return <ErrorState title="Course Not Found" description={error} onRetry={() => dispatch(fetchCourseById(courseId))} />;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Course Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary" size="sm">
            {course.category}
          </Badge>
          <Badge variant="purple" size="sm">
            {course.difficulty}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold ml-2">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{course.rating}</span>
            <span className="text-slate-400 font-normal">({course.ratingCount} reviews)</span>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            {course.title}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            {course.description || course.subtitle}
          </p>
        </div>

        {/* Instructor & Meta row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src={course.instructor?.avatar}
              alt={course.instructor?.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
            <div>
              <p className="text-xs font-bold text-slate-900">{course.instructor?.name}</p>
              <p className="text-[11px] text-slate-400">{course.instructor?.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600 font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-slate-400" />
              {course.estimatedHours} Hours
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-slate-400" />
              {course.modules?.length || 5} Modules
            </span>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto px-8"
            rightIcon={PlayCircle}
            onClick={handleEnrollOrContinue}
          >
            {course.isEnrolled ? 'Continue Learning' : 'Enroll Now (Free with AI Adaptive Path)'}
          </Button>
        </div>
      </div>

      {/* What you'll learn */}
      {course.whatYouWillLearn && (
        <Card className="p-6 border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
            What You'll Master in this Course
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {course.whatYouWillLearn.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Syllabus / Curriculum Accordion */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Course Curriculum & Adaptive Modules</h3>
          <span className="text-xs text-slate-500 font-mono">
            {course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 18} Lessons total
          </span>
        </div>

        <ModuleAccordion
          modules={course.modules || []}
          currentLessonId={course.currentLessonId}
          onSelectLesson={(lesson) => {
            if (course.isEnrolled) {
              navigate(`/learn/${course.id}/${lesson.id}`);
            } else {
              handleEnrollOrContinue();
            }
          }}
        />
      </div>
    </div>
  );
}
