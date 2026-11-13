import { storage } from '../services/storage';

const THEME_STORAGE_KEY = 'theme_preference';

/**
 * Initializes and manages dark mode state, respecting system preference and user manual override.
 */
export const themeManager = {
  getInitialTheme: () => {
    const saved = storage.get(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;

    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  },

  applyTheme: (theme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    storage.set(THEME_STORAGE_KEY, theme);
  },

  toggleTheme: () => {
    const isDark = document.documentElement.classList.contains('dark');
    const next = isDark ? 'light' : 'dark';
    themeManager.applyTheme(next);
    return next;
  },
};
