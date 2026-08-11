import { delay } from './api';
import { storage } from '../utils/storage';
import { quizService } from './quizService';

export const progressService = {
  async getStudentProgress() {
    await delay(150);
    const topicMastery = await quizService.getTopicMastery();

    const masteredCount = topicMastery.filter((t) => t.accuracy >= 80).length;
    const practiceCount = topicMastery.filter((t) => t.accuracy >= 60 && t.accuracy < 80).length;
    const revisionCount = topicMastery.filter((t) => t.accuracy < 60).length;

    const totalAccuracy = topicMastery.reduce((acc, t) => acc + t.accuracy, 0);
    const overallMastery = Math.round(totalAccuracy / (topicMastery.length || 1));

    const weeklyActivity = [
      { day: 'Mon', hours: 1.5, problemsSolved: 6, accuracy: 82 },
      { day: 'Tue', hours: 2.0, problemsSolved: 8, accuracy: 75 },
      { day: 'Wed', hours: 0.8, problemsSolved: 3, accuracy: 60 },
      { day: 'Thu', hours: 2.2, problemsSolved: 10, accuracy: 90 },
      { day: 'Fri', hours: 1.8, problemsSolved: 7, accuracy: 85 },
      { day: 'Sat', hours: 3.0, problemsSolved: 14, accuracy: 70 },
      { day: 'Sun', hours: 1.2, problemsSolved: 5, accuracy: 65 },
    ];

    const quizScoreHistory = [
      { date: 'Aug 01', score: 65, topic: 'Arrays' },
      { date: 'Aug 04', score: 85, topic: 'Arrays' },
      { date: 'Aug 07', score: 72, topic: 'Two Pointer' },
      { date: 'Aug 09', score: 78, topic: 'Two Pointer' },
      { date: 'Aug 11', score: 40, topic: 'Prefix Sum' },
    ];

    return {
      overallMastery,
      averageQuizAccuracy: 72,
      masteredTopicsCount: masteredCount,
      practiceNeededCount: practiceCount,
      revisionNeededCount: revisionCount,
      streakDays: 14,
      totalHoursLearned: 38.5,
      totalQuizzesAttempted: 12,
      topicMastery,
      weeklyActivity,
      quizScoreHistory,
    };
  },
};
