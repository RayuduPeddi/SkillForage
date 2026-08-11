import { delay } from './api';
import { COURSES_MOCK } from './mockData';
import { storage } from '../utils/storage';

const COURSES_STORAGE_KEY = 'admin_courses_list_v2';

function getStoredCourses() {
  const stored = storage.get(COURSES_STORAGE_KEY);
  if (stored && Array.isArray(stored) && stored.length > 0) {
    return stored;
  }
  const initial = COURSES_MOCK.map((c) => ({
    ...c,
    status: 'active',
    createdAt: '2025-10-15',
  }));
  storage.set(COURSES_STORAGE_KEY, initial);
  return initial;
}

export const courseService = {
  async getCourses({ search = '', category = 'all', difficulty = 'all', sortBy = 'popular', includeInactive = false } = {}) {
    await delay(150);
    let courses = [...getStoredCourses()];

    // Students only see active courses unless already enrolled
    if (!includeInactive) {
      courses = courses.filter((c) => (c.status || 'active') === 'active' || c.isEnrolled);
    }

    if (search) {
      const q = search.toLowerCase().trim();
      courses = courses.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.subtitle?.toLowerCase().includes(q) ||
          c.instructor?.name?.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'all') {
      courses = courses.filter((c) => c.category === category);
    }

    if (difficulty && difficulty !== 'all') {
      courses = courses.filter((c) => c.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    if (sortBy === 'popular') {
      courses.sort((a, b) => (b.studentsEnrolled || 0) - (a.studentsEnrolled || 0));
    } else if (sortBy === 'rating') {
      courses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'duration') {
      courses.sort((a, b) => (a.estimatedHours || 0) - (b.estimatedHours || 0));
    }

    return courses;
  },

  async getCourseById(courseId) {
    await delay(150);
    const courses = getStoredCourses();
    const course = courses.find((c) => c.id === courseId);
    if (!course) {
      throw new Error(`Course with ID "${courseId}" not found`);
    }
    return course;
  },

  async enrollCourse(courseId) {
    await delay(300);
    const courses = getStoredCourses();
    const updated = courses.map((c) => {
      if (c.id === courseId) {
        return { ...c, isEnrolled: true, progress: 0 };
      }
      return c;
    });
    storage.set(COURSES_STORAGE_KEY, updated);
    return updated.find((c) => c.id === courseId);
  },

  async updateLessonProgress(courseId, lessonId, isCompleted = true) {
    await delay(150);
    const courses = getStoredCourses();
    const course = courses.find((c) => c.id === courseId);
    if (!course) return null;

    let total = 0;
    let completed = 0;

    const updatedModules = course.modules?.map((mod) => {
      const updatedLessons = mod.lessons?.map((les) => {
        total++;
        if (les.id === lessonId) {
          if (isCompleted) completed++;
          return { ...les, completed: isCompleted };
        }
        if (les.completed) completed++;
        return les;
      });
      return { ...mod, lessons: updatedLessons };
    }) || [];

    const newProgress = total > 0 ? Math.round((completed / total) * 100) : course.progress;

    const updatedCourse = {
      ...course,
      modules: updatedModules,
      progress: newProgress,
      currentLessonId: lessonId,
    };

    const updatedList = courses.map((c) => (c.id === courseId ? updatedCourse : c));
    storage.set(COURSES_STORAGE_KEY, updatedList);

    return updatedCourse;
  },
};
