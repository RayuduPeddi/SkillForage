import { MASTERY_THRESHOLDS } from '../constants/topics';

export function calculateMasteryCategory(score) {
  if (score >= MASTERY_THRESHOLDS.MASTERED) {
    return {
      status: 'Mastered',
      color: 'emerald',
      bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badgeClass: 'text-emerald-700 bg-emerald-100',
      description: 'Strong foundation, ready for advanced applications'
    };
  }
  if (score >= MASTERY_THRESHOLDS.PRACTICE_NEEDED) {
    return {
      status: 'Needs Practice',
      color: 'amber',
      bgClass: 'bg-amber-50 text-amber-700 border-amber-200',
      badgeClass: 'text-amber-700 bg-amber-100',
      description: 'Understood core principles, requires targeted problem drills'
    };
  }
  return {
    status: 'Needs Revision',
    color: 'rose',
    bgClass: 'bg-rose-50 text-rose-700 border-rose-200',
    badgeClass: 'text-rose-700 bg-rose-100',
    description: 'Fundamental gaps detected. Conceptual recap strongly advised'
  };
}

export function calculateOverallMastery(topicScores = []) {
  if (!topicScores || topicScores.length === 0) return 0;
  const total = topicScores.reduce((acc, curr) => acc + (curr.accuracy || curr.score || 0), 0);
  return Math.round(total / topicScores.length);
}

export function calculateCourseProgress(completedLessons = [], totalLessons = 1) {
  if (!totalLessons || totalLessons <= 0) return 0;
  return Math.min(100, Math.round((completedLessons.length / totalLessons) * 100));
}
