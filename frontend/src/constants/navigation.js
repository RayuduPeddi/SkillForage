import {
  LayoutDashboard,
  BookOpen,
  Compass,
  Target,
  Bot,
  TrendingUp,
  GitFork,
  BarChart3,
  User,
  Settings,
  PlusCircle,
  HelpCircle,
  Users,
  Shield,
  FileText
} from 'lucide-react';
import { ROUTES } from './routes';

export const STUDENT_NAV_ITEMS = [
  { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { name: 'My Learning', path: ROUTES.MY_LEARNING, icon: BookOpen },
  { name: 'Explore Courses', path: ROUTES.COURSES, icon: Compass },
  { name: 'Learning Path', path: ROUTES.LEARNING_PATH, icon: GitFork, badge: 'Adaptive' },
  { name: 'Practice Hub', path: ROUTES.PRACTICE, icon: Target },
  { name: 'AI Mentor', path: ROUTES.AI_MENTOR, icon: Bot, badge: 'AI' },
  { name: 'Learning Analysis', path: ROUTES.LEARNING_ANALYSIS, icon: BarChart3 },
  { name: 'Progress', path: ROUTES.PROGRESS, icon: TrendingUp },
];

export const STUDENT_SECONDARY_NAV = [
  { name: 'Profile', path: ROUTES.STUDENT_PROFILE, icon: User },
  { name: 'Settings', path: ROUTES.STUDENT_SETTINGS, icon: Settings },
];

export const INSTRUCTOR_NAV_ITEMS = [
  { name: 'Dashboard', path: ROUTES.INSTRUCTOR_DASHBOARD, icon: LayoutDashboard },
  { name: 'My Courses', path: ROUTES.INSTRUCTOR_COURSES, icon: BookOpen },
  { name: 'Create Course', path: ROUTES.INSTRUCTOR_COURSE_BUILDER, icon: PlusCircle },
  { name: 'Question Bank', path: ROUTES.INSTRUCTOR_QUESTIONS, icon: HelpCircle },
  { name: 'Students', path: ROUTES.INSTRUCTOR_STUDENTS, icon: Users },
  { name: 'Analytics', path: ROUTES.INSTRUCTOR_ANALYTICS, icon: BarChart3 },
];

export const ADMIN_NAV_ITEMS = [
  { name: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
  { name: 'Users', path: ROUTES.ADMIN_USERS, icon: Users },
  { name: 'Courses', path: ROUTES.ADMIN_COURSES, icon: BookOpen },
  { name: 'Reports', path: ROUTES.ADMIN_REPORTS, icon: FileText },
  { name: 'Platform Settings', path: ROUTES.ADMIN_SETTINGS, icon: Shield },
];
