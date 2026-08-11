import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VideoPlayer } from '../../components/course/VideoPlayer';
import { LessonContent } from '../../components/course/LessonContent';
import { ModuleAccordion } from '../../components/course/ModuleAccordion';
import { NotesPanel } from '../../components/course/NotesPanel';
import { LoadingState } from '../../components/ui/LoadingState';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourseById, markLessonComplete } from '../../store/slices/courseSlice';
import { ArrowLeft, Menu, Sparkles, BookOpen, Layers, Brain, MessageSquare } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export function CourseLearn() {
  const { courseId, lessonId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentCourse: course, isLoading } = useSelector((state) => state.courses);
  const { success: toastSuccess } = useToast();

  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'resources'
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseById(courseId));
    }
  }, [dispatch, courseId]);

  if (isLoading || !course) {
    return <LoadingState message="Loading course environment..." />;
  }

  // Find all flat lessons
  const allLessons = course.modules?.flatMap((m) => m.lessons || []) || [];
  const currentLessonIndex = allLessons.findIndex((l) => l.id === lessonId);
  const currentLesson = allLessons[currentLessonIndex] || allLessons[0];

  const hasPrevious = currentLessonIndex > 0;
  const hasNext = currentLessonIndex < allLessons.length - 1;

  const handleLessonSelect = (lesson) => {
    navigate(`/learn/${course.id}/${lesson.id}`);
  };

  const handlePrevious = () => {
    if (hasPrevious) {
      navigate(`/learn/${course.id}/${allLessons[currentLessonIndex - 1].id}`);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      navigate(`/learn/${course.id}/${allLessons[currentLessonIndex + 1].id}`);
    }
  };

  const handleMarkComplete = async () => {
    if (!currentLesson) return;
    await dispatch(markLessonComplete({ courseId: course.id, lessonId: currentLesson.id }));
    toastSuccess('Lesson Completed!', 'Your course progress and topic mastery metrics have updated.');
    if (hasNext) {
      handleNext();
    }
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      {/* Top Navbar strip */}
      <div className="bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-card flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={ArrowLeft}
            onClick={() => navigate(`/courses/${course.id}`)}
          >
            Course Details
          </Button>
          <div className="h-4 w-px bg-slate-200 hidden sm:block" />
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-md">
              {course.title}
            </h2>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              {currentLesson?.title || 'Lesson Stream'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span>Adaptive Progress: {course.progress || 0}%</span>
            <div className="w-24">
              <ProgressBar value={course.progress || 0} size="sm" color="brand" />
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            leftIcon={Menu}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            Modules
          </Button>
        </div>
      </div>

      {/* 3-Column Learning Player */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Modules Accordion */}
        <div className={`lg:col-span-3 space-y-4 ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-brand-600" />
              Course Syllabus
            </h3>
            <ModuleAccordion
              modules={course.modules || []}
              currentLessonId={currentLesson?.id}
              onSelectLesson={handleLessonSelect}
              interactive={true}
            />
          </div>
        </div>

        {/* Center: Video Player & Main Lesson Content */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-card space-y-6">
            {/* Video Player with YouTube Support */}
            {currentLesson?.videoUrl && (
              <VideoPlayer videoUrl={currentLesson.videoUrl} title={currentLesson.title} />
            )}

            {/* Lesson details and actions */}
            <LessonContent
              lesson={currentLesson}
              courseId={course.id}
              isCompleted={currentLesson?.completed}
              onMarkComplete={handleMarkComplete}
              onPrevious={handlePrevious}
              onNext={handleNext}
              hasPrevious={hasPrevious}
              hasNext={hasNext}
            />
          </div>
        </div>

        {/* Right: Notes Panel & Lesson Context */}
        <div className="lg:col-span-3 space-y-4">
          <NotesPanel lessonId={currentLesson?.id} />

          {/* Quick AI Adaptive Tip Card */}
          <div className="bg-gradient-to-br from-purple-50 via-white to-brand-50 p-4 rounded-2xl border border-purple-200 shadow-card space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Adaptive Lesson Assistant</span>
            </div>
            <p className="text-xs text-purple-900/90 leading-relaxed">
              Have questions about <strong className="text-slate-900">{currentLesson?.title || 'this topic'}</strong>? The AI Mentor is primed with this lesson's concepts and your diagnostic score.
            </p>
            <Button
              variant="outline"
              size="sm"
              leftIcon={MessageSquare}
              className="w-full text-purple-700 border-purple-300 hover:bg-purple-100/50"
              onClick={() => navigate('/ai-mentor')}
            >
              Ask AI Mentor About Lesson
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
