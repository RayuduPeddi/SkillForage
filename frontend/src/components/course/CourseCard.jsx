import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { Star, Clock, BookOpen, User, PlayCircle, ArrowRight, Sparkles } from 'lucide-react';
import { getAutoCourseThumbnail } from '../../utils/courseThumbnails';
import { ROUTES } from '../../constants/routes';

export function CourseCard({ course }) {
  const navigate = useNavigate();

  const difficultyColors = {
    Beginner: 'primary',
    Intermediate: 'purple',
    Advanced: 'warning',
  };

  const thumbnailSrc = course.thumbnail || getAutoCourseThumbnail(course.category, course.title);

  const handleCardClick = () => {
    if (course.isEnrolled && course.currentLessonId) {
      navigate(`/learn/${course.id}/${course.currentLessonId}`);
    } else {
      navigate(`/courses/${course.id}`);
    }
  };

  return (
    <Card hover className="flex flex-col h-full group cursor-pointer border-slate-200 shadow-card hover:shadow-card-hover transition-all" onClick={handleCardClick}>
      {/* Thumbnail with Badges */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 border-b border-slate-100">
        <img
          src={thumbnailSrc}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          <Badge variant={difficultyColors[course.difficulty] || 'default'} size="sm">
            {course.difficulty}
          </Badge>
          {course.isEnrolled && (
            <Badge variant="success" size="sm">
              Enrolled
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500">
            <span className="font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-md">
              {course.category}
            </span>
            <div className="flex items-center gap-1 text-amber-600 font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{course.rating || 4.9}</span>
              <span className="text-slate-400 font-normal">({course.ratingCount || 120})</span>
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-brand-600 transition-colors leading-snug">
            {course.title}
          </h3>

          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {course.subtitle || course.description}
          </p>
        </div>

        {/* Footer Meta & CTA */}
        <div className="pt-3.5 border-t border-slate-100 space-y-3.5">
          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500">
            <div className="flex items-center gap-2 truncate max-w-[12rem]">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate font-medium">{course.instructor?.name || 'SkillForage Academic'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 font-medium shrink-0">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{course.estimatedHours}h</span>
            </div>
          </div>

          {course.isEnrolled ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  Adaptive Progress
                </span>
                <span className="font-bold text-slate-900">{course.progress || 0}%</span>
              </div>
              <ProgressBar value={course.progress || 0} size="sm" color="brand" />
              <Button
                variant="primary"
                size="md"
                className="w-full mt-2 text-sm font-semibold"
                rightIcon={PlayCircle}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/learn/${course.id}/${course.currentLessonId || 'lesson-1'}`);
                }}
              >
                Continue Learning
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="md"
              className="w-full group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition-all text-sm font-semibold"
              rightIcon={ArrowRight}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/courses/${course.id}`);
              }}
            >
              View Course Details
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
