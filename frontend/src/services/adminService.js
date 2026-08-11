import { delay } from './api';
import { ADMIN_STATS_MOCK, COURSES_MOCK } from './mockData';
import { storage } from '../utils/storage';
import { getAutoCourseThumbnail } from '../utils/courseThumbnails';

const ADMIN_USERS_KEY = 'admin_users_list_v2';
const ADMIN_COURSES_KEY = 'admin_courses_list_v2';

function getStoredUsers() {
  let users = storage.get(ADMIN_USERS_KEY);
  if (!users || !Array.isArray(users) || users.length === 0) {
    users = ADMIN_STATS_MOCK.usersList;
    storage.set(ADMIN_USERS_KEY, users);
  }
  return users;
}

function getStoredCourses() {
  let courses = storage.get(ADMIN_COURSES_KEY);
  if (!courses || !Array.isArray(courses) || courses.length === 0) {
    courses = INITIAL_COURSES.map((c) => ({
      ...c,
      status: 'active', // 'active' | 'inactive' | 'draft' | 'archived'
      createdAt: '2025-10-15',
    }));
    storage.set(ADMIN_COURSES_KEY, courses);
  }
  return courses;
}

export const adminService = {
  // ==========================
  // DASHBOARD & OVERVIEW STATS
  // ==========================
  async getDashboardStats() {
    await delay(120);
    const users = getStoredUsers();
    const courses = getStoredCourses();

    const activeStudents = users.filter((u) => u.role === 'student' && u.status === 'active').length;
    const instructors = users.filter((u) => u.role === 'instructor').length;
    const activeCourses = courses.filter((c) => c.status === 'active').length;
    const totalEnrollments = courses.reduce((acc, c) => acc + (c.studentsEnrolled || 0), 0);

    return {
      totalUsers: users.length,
      activeStudents,
      instructors,
      totalCourses: courses.length,
      activeCourses,
      totalEnrollments,
      platformCompletionRate: 74.2,
      dailyActiveLearners: Math.round(users.length * 0.7),
      usersList: users.slice(0, 5),
      coursesList: courses.slice(0, 5),
    };
  },

  // ==========================
  // USER CRUD OPERATIONS
  // ==========================
  async getUsers({ search = '', role = 'all', status = 'all', sortBy = 'name' } = {}) {
    await delay(120);
    let users = getStoredUsers();

    if (search) {
      const q = search.toLowerCase().trim();
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.headline && u.headline.toLowerCase().includes(q))
      );
    }

    if (role && role !== 'all') {
      users = users.filter((u) => u.role === role);
    }

    if (status && status !== 'all') {
      users = users.filter((u) => u.status === status);
    }

    if (sortBy === 'name') {
      users.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'joined') {
      users.sort((a, b) => new Date(b.joined || 0) - new Date(a.joined || 0));
    } else if (sortBy === 'role') {
      users.sort((a, b) => a.role.localeCompare(b.role));
    }

    return users;
  },

  async getUserById(userId) {
    await delay(100);
    const users = getStoredUsers();
    return users.find((u) => u.id === userId) || null;
  },

  async createUser(userData) {
    await delay(200);
    const users = getStoredUsers();

    const email = userData.email?.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === email)) {
      throw new Error(`A user with email "${email}" already exists.`);
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: userData.name?.trim(),
      email,
      role: userData.role || 'student',
      status: userData.status || 'active',
      joined: new Date().toISOString().split('T')[0],
      headline: userData.headline || (userData.role === 'instructor' ? 'Instructor & Subject Matter Specialist' : 'Student Learner'),
      avatar:
        userData.avatar ||
        (userData.role === 'instructor'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
      coursesEnrolled: userData.role === 'student' ? (userData.coursesEnrolled || 0) : undefined,
      coursesCreated: userData.role === 'instructor' ? (userData.coursesCreated || 0) : undefined,
      mastery: userData.role === 'student' ? (userData.mastery || 65) : undefined,
      rating: userData.role === 'instructor' ? (userData.rating || 5.0) : undefined,
      streak: userData.role === 'student' ? 1 : undefined,
    };

    const updated = [newUser, ...users];
    storage.set(ADMIN_USERS_KEY, updated);
    return newUser;
  },

  async updateUser(userId, updates) {
    await delay(200);
    const users = getStoredUsers();
    let updatedUser = null;

    const updatedList = users.map((u) => {
      if (u.id === userId) {
        updatedUser = { ...u, ...updates };
        return updatedUser;
      }
      return u;
    });

    if (!updatedUser) throw new Error('User not found.');

    storage.set(ADMIN_USERS_KEY, updatedList);
    return updatedUser;
  },

  async toggleUserStatus(userId) {
    await delay(150);
    const users = getStoredUsers();
    let updatedUser = null;

    const updatedList = users.map((u) => {
      if (u.id === userId) {
        const nextStatus = u.status === 'active' ? 'inactive' : 'active';
        updatedUser = { ...u, status: nextStatus };
        return updatedUser;
      }
      return u;
    });

    if (!updatedUser) throw new Error('User not found.');

    storage.set(ADMIN_USERS_KEY, updatedList);
    return updatedUser;
  },

  async deleteUser(userId) {
    await delay(200);
    const users = getStoredUsers();
    const filtered = users.filter((u) => u.id !== userId);
    storage.set(ADMIN_USERS_KEY, filtered);
    return { success: true, id: userId };
  },

  // ==========================
  // COURSE CRUD OPERATIONS
  // ==========================
  async getCourses({ search = '', category = 'all', status = 'all', sortBy = 'title' } = {}) {
    await delay(120);
    let courses = getStoredCourses();

    if (search) {
      const q = search.toLowerCase().trim();
      courses = courses.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          (c.instructor?.name && c.instructor.name.toLowerCase().includes(q))
      );
    }

    if (category && category !== 'all') {
      courses = courses.filter((c) => c.category === category);
    }

    if (status && status !== 'all') {
      courses = courses.filter((c) => (c.status || 'active') === status);
    }

    if (sortBy === 'title') {
      courses.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'students') {
      courses.sort((a, b) => (b.studentsEnrolled || 0) - (a.studentsEnrolled || 0));
    } else if (sortBy === 'rating') {
      courses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return courses;
  },

  async getCourseById(courseId) {
    await delay(100);
    const courses = getStoredCourses();
    return courses.find((c) => c.id === courseId) || null;
  },

  async createCourse(courseData) {
    await delay(200);
    const courses = getStoredCourses();

    const newCourse = {
      id: `course_${Date.now()}`,
      title: courseData.title?.trim(),
      subtitle: courseData.subtitle || 'Adaptive curriculum managed by institution',
      category: courseData.category || 'Data Structures & Algorithms',
      difficulty: courseData.difficulty || 'Intermediate',
      estimatedHours: Number(courseData.estimatedHours) || 20,
      thumbnail: courseData.thumbnail || getAutoCourseThumbnail(courseData.category, courseData.title),
      status: courseData.status || 'active',
      instructor: {
        name: courseData.instructorName || 'Dr. Emily Watson',
        title: courseData.instructorTitle || 'Curriculum Lead',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      },
      rating: 5.0,
      ratingCount: 1,
      studentsEnrolled: 0,
      modulesCount: courseData.modulesCount || 4,
      lessonsCount: courseData.lessonsCount || 12,
      createdAt: new Date().toISOString().split('T')[0],
      description: courseData.description || 'Comprehensive interactive academic curriculum with continuous adaptive diagnostics.',
    };

    const updated = [newCourse, ...courses];
    storage.set(ADMIN_COURSES_KEY, updated);
    return newCourse;
  },

  async updateCourse(courseId, updates) {
    await delay(200);
    const courses = getStoredCourses();
    let updatedCourse = null;

    const updatedList = courses.map((c) => {
      if (c.id === courseId) {
        // Automatically sync thumbnail if category/title updated and no custom thumbnail provided
        const thumb = updates.thumbnail || c.thumbnail || getAutoCourseThumbnail(updates.category || c.category, updates.title || c.title);
        updatedCourse = {
          ...c,
          ...updates,
          thumbnail: thumb,
        };
        return updatedCourse;
      }
      return c;
    });

    if (!updatedCourse) throw new Error('Course not found.');

    storage.set(ADMIN_COURSES_KEY, updatedList);
    return updatedCourse;
  },

  async toggleCourseStatus(courseId) {
    await delay(150);
    const courses = getStoredCourses();
    let updatedCourse = null;

    const updatedList = courses.map((c) => {
      if (c.id === courseId) {
        const nextStatus = (c.status || 'active') === 'active' ? 'inactive' : 'active';
        updatedCourse = { ...c, status: nextStatus };
        return updatedCourse;
      }
      return c;
    });

    if (!updatedCourse) throw new Error('Course not found.');

    storage.set(ADMIN_COURSES_KEY, updatedList);
    return updatedCourse;
  },

  async deleteCourse(courseId) {
    await delay(200);
    const courses = getStoredCourses();
    const filtered = courses.filter((c) => c.id !== courseId);
    storage.set(ADMIN_COURSES_KEY, filtered);
    return { success: true, id: courseId };
  },

  // ==========================
  // PLATFORM REPORTS & ANALYTICS
  // ==========================
  async getPlatformReports() {
    await delay(150);
    return {
      monthlyEnrollments: [
        { month: 'Jan', enrollments: 1200, completions: 840 },
        { month: 'Feb', enrollments: 1900, completions: 1350 },
        { month: 'Mar', enrollments: 2400, completions: 1800 },
        { month: 'Apr', enrollments: 3100, completions: 2200 },
        { month: 'May', enrollments: 3800, completions: 2900 },
        { month: 'Jun', enrollments: 4500, completions: 3400 },
        { month: 'Jul', enrollments: 5200, completions: 4100 },
        { month: 'Aug', enrollments: 6400, completions: 4850 },
      ],
      topicAccuracyDistribution: [
        { topic: 'Arrays & Two Pointers', accuracy: 88, students: 4120, status: 'Strong' },
        { topic: 'Sliding Window', accuracy: 64, students: 3540, status: 'Moderate' },
        { topic: 'HashMap & Frequency Sets', accuracy: 56, students: 2980, status: 'Needs Practice' },
        { topic: 'Binary Search Spaces', accuracy: 48, students: 2410, status: 'Needs Revision' },
        { topic: 'Prefix Sum & Subarrays', accuracy: 43, students: 3200, status: 'Needs Revision' },
        { topic: 'Tree Traversals & BST', accuracy: 38, students: 1950, status: 'Critical Gap' },
      ],
      learnerEngagement: {
        aiTutorQueriesDaily: 1420,
        averageSessionMins: 42,
        quizCompletionRate: 81.4,
        activeStreakAverageDays: 8.6,
      },
    };
  },
};
