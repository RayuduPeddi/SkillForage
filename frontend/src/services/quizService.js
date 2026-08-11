import { delay } from './api';
import { QUIZZES_MOCK, INITIAL_TOPIC_MASTERY } from './mockData';
import { storage } from '../utils/storage';
import { calculateMasteryCategory } from '../utils/calculations';

const TOPIC_MASTERY_KEY = 'topic_mastery';
const QUIZ_HISTORY_KEY = 'quiz_attempts';

export const quizService = {
  async getQuizById(quizId) {
    await delay(150);
    const quiz = QUIZZES_MOCK[quizId] || QUIZZES_MOCK['quiz-prefix-sum'];
    return quiz;
  },

  async submitQuiz(quizId, answers, timeSpentSeconds = 120) {
    await delay(350);
    const quiz = QUIZZES_MOCK[quizId] || QUIZZES_MOCK['quiz-prefix-sum'];

    let correctCount = 0;
    const topicBreakdown = {};

    const evaluatedQuestions = quiz.questions.map((q) => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;

      if (isCorrect) correctCount++;

      // Track by topic
      if (!topicBreakdown[q.topic]) {
        topicBreakdown[q.topic] = { total: 0, correct: 0, topic: q.topic };
      }
      topicBreakdown[q.topic].total += 1;
      if (isCorrect) topicBreakdown[q.topic].correct += 1;

      return {
        ...q,
        userAnswer,
        isCorrect,
      };
    });

    const totalQuestions = quiz.questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);

    // Update stored topic mastery based on this attempt!
    const currentMasteryList = storage.get(TOPIC_MASTERY_KEY) || INITIAL_TOPIC_MASTERY;
    const updatedMasteryList = currentMasteryList.map((item) => {
      const breakdown = topicBreakdown[item.topic];
      if (breakdown) {
        const attemptAccuracy = Math.round((breakdown.correct / breakdown.total) * 100);
        // Exponential moving average: 60% new attempt, 40% old accuracy
        const newAccuracy = Math.round(item.accuracy * 0.4 + attemptAccuracy * 0.6);
        const { status } = calculateMasteryCategory(newAccuracy);

        return {
          ...item,
          accuracy: newAccuracy,
          attempts: (item.attempts || 0) + 1,
          timeSpentMins: (item.timeSpentMins || 0) + Math.round(timeSpentSeconds / 60),
          status,
          lastTested: new Date().toISOString().split('T')[0],
        };
      }
      return item;
    });

    storage.set(TOPIC_MASTERY_KEY, updatedMasteryList);

    const result = {
      id: `attempt_${Date.now()}`,
      quizId,
      quizTitle: quiz.title,
      score,
      correctCount,
      totalQuestions,
      timeSpentSeconds,
      submittedAt: new Date().toISOString(),
      topicBreakdown: Object.values(topicBreakdown).map((t) => ({
        topic: t.topic,
        total: t.total,
        correct: t.correct,
        accuracy: Math.round((t.correct / t.total) * 100),
      })),
      evaluatedQuestions,
    };

    // Store in history
    const history = storage.get(QUIZ_HISTORY_KEY) || [];
    storage.set(QUIZ_HISTORY_KEY, [result, ...history]);

    return result;
  },

  async getTopicMastery() {
    await delay(150);
    return storage.get(TOPIC_MASTERY_KEY) || INITIAL_TOPIC_MASTERY;
  },

  async resetMastery() {
    storage.set(TOPIC_MASTERY_KEY, INITIAL_TOPIC_MASTERY);
    return INITIAL_TOPIC_MASTERY;
  },
};
