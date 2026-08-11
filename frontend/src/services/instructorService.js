import { delay } from './api';
import { INSTRUCTOR_STATS_MOCK, COURSES_MOCK } from './mockData';
import { storage } from '../utils/storage';

const INSTRUCTOR_COURSES_KEY = 'instructor_courses';

export const instructorService = {
  async getDashboardStats() {
    await delay(150);
    return INSTRUCTOR_STATS_MOCK;
  },

  async getMyCourses() {
    await delay(150);
    const stored = storage.get(INSTRUCTOR_COURSES_KEY);
    if (stored) return stored;
    storage.set(INSTRUCTOR_COURSES_KEY, COURSES_MOCK);
    return COURSES_MOCK;
  },

  async createCourse(courseData) {
    await delay(300);
    const existing = (await this.getMyCourses()) || [];
    const newCourse = {
      ...courseData,
      id: `course_${Date.now()}`,
      slug: courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: 5.0,
      ratingCount: 0,
      studentsEnrolled: 0,
      progress: 0,
      isEnrolled: false,
      createdAt: new Date().toISOString(),
      instructor: {
        name: 'Dr. Emily Watson',
        title: 'Lead Instructor',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      },
    };

    const updated = [newCourse, ...existing];
    storage.set(INSTRUCTOR_COURSES_KEY, updated);
    return newCourse;
  },

  async updateCourse(courseId, updates) {
    await delay(300);
    const existing = await this.getMyCourses();
    const updated = existing.map((c) => (c.id === courseId ? { ...c, ...updates } : c));
    storage.set(INSTRUCTOR_COURSES_KEY, updated);
    return updated.find((c) => c.id === courseId);
  },

  async deleteCourse(courseId) {
    await delay(200);
    const existing = await this.getMyCourses();
    const filtered = existing.filter((c) => c.id !== courseId);
    storage.set(INSTRUCTOR_COURSES_KEY, filtered);
    return true;
  },

  async getCourseAnalytics(courseId) {
    await delay(200);
    return {
      courseId,
      totalEnrolled: 8940,
      completionRate: 68.4,
      avgQuizScore: 76.2,
      activeThisWeek: 1280,
      dropoffPoints: [
        { lesson: 'Dynamic Arrays', completionRate: 98 },
        { lesson: 'Two Pointers', completionRate: 88 },
        { lesson: 'Prefix Sum Basics', completionRate: 72 },
        { lesson: 'Difference Arrays', completionRate: 48 },
        { lesson: 'Hash Table Collisions', completionRate: 64 },
      ],
      topicAccuracyCohort: [
        { topic: 'Arrays', avgAccuracy: 88 },
        { topic: 'Two Pointer', avgAccuracy: 79 },
        { topic: 'Sliding Window', avgAccuracy: 64 },
        { topic: 'HashMap', avgAccuracy: 61 },
        { topic: 'Prefix Sum', avgAccuracy: 49 },
        { topic: 'Trees', avgAccuracy: 42 },
      ],
    };
  },
};
