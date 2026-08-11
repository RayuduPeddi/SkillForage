import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTopicMastery } from '../store/slices/quizSlice';
import { fetchRecommendations } from '../store/slices/recommendationSlice';
import { fetchLearningPath } from '../store/slices/learningSlice';
import { calculateMasteryCategory } from '../utils/calculations';

export function useAdaptiveEngine() {
  const dispatch = useDispatch();
  const topicMastery = useSelector((state) => state.quiz.topicMastery);
  const recommendations = useSelector((state) => state.recommendations.recommendations);
  const learningPath = useSelector((state) => state.learning.learningPath);

  useEffect(() => {
    if (!topicMastery || topicMastery.length === 0) {
      dispatch(fetchTopicMastery());
    }
    if (!recommendations || recommendations.length === 0) {
      dispatch(fetchRecommendations());
    }
    if (!learningPath || learningPath.length === 0) {
      dispatch(fetchLearningPath());
    }
  }, [dispatch, topicMastery, recommendations, learningPath]);

  const weakTopics = (topicMastery || []).filter((t) => t.accuracy < 60);
  const strongTopics = (topicMastery || []).filter((t) => t.accuracy >= 80);
  const practiceTopics = (topicMastery || []).filter((t) => t.accuracy >= 60 && t.accuracy < 80);

  const overallMastery =
    topicMastery && topicMastery.length > 0
      ? Math.round(topicMastery.reduce((acc, t) => acc + t.accuracy, 0) / topicMastery.length)
      : 0;

  return {
    topicMastery,
    weakTopics,
    strongTopics,
    practiceTopics,
    recommendations,
    learningPath,
    overallMastery,
    getTopicStatus: (score) => calculateMasteryCategory(score),
    refreshAdaptiveData: () => {
      dispatch(fetchTopicMastery());
      dispatch(fetchRecommendations());
      dispatch(fetchLearningPath());
    },
  };
}
