import { delay } from './api';
import { LEARNING_PATH_MOCK, RECENT_ACTIVITY_MOCK } from './mockData';
import { storage } from '../utils/storage';

const PATH_STORAGE_KEY = 'learning_path';
const ACTIVITY_STORAGE_KEY = 'recent_activity';
const NOTES_STORAGE_KEY = 'lesson_notes';

export const learningService = {
  async getLearningPath() {
    await delay(150);
    const path = storage.get(PATH_STORAGE_KEY) || LEARNING_PATH_MOCK;
    return path;
  },

  async getRecentActivity() {
    await delay(100);
    const activity = storage.get(ACTIVITY_STORAGE_KEY) || RECENT_ACTIVITY_MOCK;
    return activity;
  },

  async logActivity(item) {
    const list = storage.get(ACTIVITY_STORAGE_KEY) || RECENT_ACTIVITY_MOCK;
    const updated = [{ ...item, id: `act_${Date.now()}`, timestamp: new Date().toISOString() }, ...list].slice(0, 10);
    storage.set(ACTIVITY_STORAGE_KEY, updated);
    return updated;
  },

  async getNotes(lessonId) {
    const allNotes = storage.get(NOTES_STORAGE_KEY) || {};
    return allNotes[lessonId] || '';
  },

  async saveNotes(lessonId, content) {
    const allNotes = storage.get(NOTES_STORAGE_KEY) || {};
    allNotes[lessonId] = content;
    storage.set(NOTES_STORAGE_KEY, allNotes);
    return content;
  },
};
