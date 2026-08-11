import { delay } from './api';
import { INITIAL_RECOMMENDATIONS, PRACTICE_PROBLEMS_MOCK } from './mockData';
import { storage } from '../utils/storage';
import { quizService } from './quizService';

const REC_STORAGE_KEY = 'recommendations_list';

export const recommendationService = {
  async getRecommendations() {
    await delay(150);
    const stored = storage.get(REC_STORAGE_KEY);
    if (stored) return stored;

    // Dynamically generate from topic mastery
    const topicMastery = await quizService.getTopicMastery();
    const weakTopics = topicMastery.filter((t) => t.accuracy < 60);

    const generated = weakTopics.map((t, idx) => ({
      id: `rec_gen_${idx}`,
      topic: t.topic,
      type: t.accuracy < 50 ? 'revision' : 'practice',
      title: `${t.accuracy < 50 ? 'Review' : 'Practice'} ${t.topic} Fundamentals`,
      reason: `Your recent accuracy in ${t.topic} is ${t.accuracy}% (${t.status}).`,
      actionText: t.accuracy < 50 ? 'Review Lesson' : 'Practice Problems',
      actionLink: t.accuracy < 50 ? `/learn/dsa-mastery/lesson-1` : `/practice?topic=${t.id}`,
      urgency: t.accuracy < 50 ? 'high' : 'medium',
      estimatedMins: 20,
    }));

    return generated.length > 0 ? generated : INITIAL_RECOMMENDATIONS;
  },

  async getPracticeProblems(filterTopic = 'all', difficulty = 'all') {
    await delay(150);
    let problems = [...PRACTICE_PROBLEMS_MOCK];

    if (filterTopic && filterTopic !== 'all') {
      problems = problems.filter(
        (p) => p.topic.toLowerCase().includes(filterTopic.toLowerCase()) || p.id === filterTopic
      );
    }

    if (difficulty && difficulty !== 'all') {
      problems = problems.filter((p) => p.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    return problems;
  },
};
