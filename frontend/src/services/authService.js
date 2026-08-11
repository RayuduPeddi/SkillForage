import { delay } from './api';
import { REGISTERED_USERS, INITIAL_USER } from './mockData';
import { storage } from '../utils/storage';

const USER_STORAGE_KEY = 'current_user';
const TOKEN_KEY = 'auth_token';

export const authService = {
  async login({ email, password, remember = true }) {
    await delay(250);

    const cleanEmail = email?.trim().toLowerCase();
    const registeredUser = REGISTERED_USERS[cleanEmail];

    if (!registeredUser) {
      throw new Error('Account not found. Please use a registered role account (admin@skillforage.edu, instructor@skillforage.edu, or rayudu@skillforage.edu).');
    }

    if (registeredUser.password !== password?.trim()) {
      throw new Error(`Invalid password for ${cleanEmail}. Please use the assigned role password.`);
    }

    const { password: _, ...userWithoutPassword } = registeredUser;
    const token = `auth_token_${userWithoutPassword.role}_${Date.now()}`;

    if (remember) {
      storage.set(TOKEN_KEY, token);
      storage.set(USER_STORAGE_KEY, userWithoutPassword);
    }

    return { user: userWithoutPassword, token };
  },

  async signup({ name, email, password }) {
    await delay(300);

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name?.trim() || 'New Learner',
      email: email?.trim().toLowerCase(),
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      onboardingCompleted: false,
      streak: 1,
      joinedDate: new Date().toISOString().split('T')[0],
    };

    const token = `auth_token_student_${Date.now()}`;
    storage.set(TOKEN_KEY, token);
    storage.set(USER_STORAGE_KEY, newUser);

    return { user: newUser, token };
  },

  async getCurrentUser() {
    await delay(100);
    const token = storage.get(TOKEN_KEY);
    if (!token) return null;
    const user = storage.get(USER_STORAGE_KEY) || INITIAL_USER;
    return user;
  },

  async updateProfile(updates) {
    await delay(150);
    const current = storage.get(USER_STORAGE_KEY) || INITIAL_USER;
    const updated = { ...current, ...updates };
    storage.set(USER_STORAGE_KEY, updated);
    return updated;
  },

  async completeOnboarding(onboardingData) {
    await delay(200);
    const current = storage.get(USER_STORAGE_KEY) || INITIAL_USER;
    const updated = {
      ...current,
      ...onboardingData,
      onboardingCompleted: true,
    };
    storage.set(USER_STORAGE_KEY, updated);
    return updated;
  },

  async logout() {
    await delay(100);
    storage.remove(TOKEN_KEY);
    storage.remove(USER_STORAGE_KEY);
  },
};

