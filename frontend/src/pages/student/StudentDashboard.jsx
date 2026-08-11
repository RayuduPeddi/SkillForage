import React, { useEffect } from 'react';
import { WelcomeBanner } from '../../components/dashboard/WelcomeBanner';
import { AdaptiveLearningHub } from '../../components/dashboard/AdaptiveLearningHub';
import { ContinueLearningCard } from '../../components/dashboard/ContinueLearningCard';
import { LearningPathProgress } from '../../components/dashboard/LearningPathProgress';
import { RecommendationCard } from '../../components/dashboard/RecommendationCard';
import { RecentActivityList } from '../../components/dashboard/RecentActivityList';
import { DashboardSkeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import { useAdaptiveEngine } from '../../hooks/useAdaptiveEngine';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses } from '../../store/slices/courseSlice';
import { fetchRecentActivity } from '../../store/slices/learningSlice';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

export function StudentDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { learningPath, recommendations, weakTopics, strongTopics, overallMastery } = useAdaptiveEngine();
  const { courses, isLoading: coursesLoading } = useSelector((state) => state.courses);
  const recentActivities = useSelector((state) => state.learning.recentActivity);

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchRecentActivity());
  }, [dispatch]);

  const currentCourse = courses?.find((c) => c.isEnrolled) || courses?.[0];
  const primaryRecommendation = recommendations?.[0];

  if (coursesLoading && !courses.length) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* 1. Welcome Banner */}
      <WelcomeBanner />

      {/* 2. Prominent AI Adaptive Learning Command Center */}
      <AdaptiveLearningHub
        overallMastery={overallMastery || 72}
        weakTopics={weakTopics}
        strongTopics={strongTopics}
        recommendations={recommendations}
        streak={14}
      />

      {/* 3. Two-Column Layout: Continue Learning & Learning Path */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ContinueLearningCard course={currentCourse} />
          <RecentActivityList activities={recentActivities} />
        </div>

        <div className="space-y-6">
          <LearningPathProgress path={learningPath} />
        </div>
      </div>
    </div>
  );
}
