import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { PlayCircle, BookOpen, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ContinueLearningCard({ course }) {
  const navigate = useNavigate();

  if (!course) return null;

  return (
    <Card className="border-slate-200/90 shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-600" />
            <CardTitle>Continue Learning</CardTitle>
          </div>
          <Badge variant="primary" size="sm">
            Current Enrolled Course
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-900 leading-snug">{course.title}</h4>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-brand-700">{course.currentModuleTitle || 'Module 2: Subarray Optimization'}</span>
              <span>•</span>
              <span className="text-slate-600 font-mono">Current: Prefix Sum Fundamentals</span>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            rightIcon={PlayCircle}
            onClick={() => navigate(`/learn/${course.id}/${course.currentLessonId || 'lesson-prefix-sum'}`)}
            className="shrink-0"
          >
            Continue Lesson
          </Button>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
            <span>Course Progress</span>
            <span className="font-mono">{course.progress || 44}%</span>
          </div>
          <ProgressBar value={course.progress || 44} size="md" color="brand" />
        </div>
      </CardContent>
    </Card>
  );
}
