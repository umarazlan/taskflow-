// LocalStorage helper with type safety and error fallback

const PREFIX = 'taskflow_';

export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`[storage] Error reading key "${key}":`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[storage] Error saving key "${key}":`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch (error) {
      console.error(`[storage] Error removing key "${key}":`, error);
    }
  },

  clearAll: () => {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(PREFIX))
        .forEach((k) => localStorage.removeItem(k));
    } catch (error) {
      console.error('[storage] Error clearing taskflow data:', error);
    }
  },
};
