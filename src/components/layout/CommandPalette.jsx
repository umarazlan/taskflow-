import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Calendar,
  Users,
  BarChart3,
  Settings,
  Plus,
  Moon,
  Sun,
  LogOut,
  RotateCcw,
  Sparkles,
  Command,
} from 'lucide-react';
import { useHotkeys } from '../../hooks/useHotkeys';
import { useAuth } from '../../context/AuthContext';
import { notify } from '../ui';
import { storage } from '../../services/storage';

export function CommandPalette({ isOpen, onClose, onOpenCreateTask, onOpenCreateProject }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Hotkey listener for Ctrl+K / Cmd+K
  useHotkeys('k', () => {
    if (isOpen) onClose();
    else setQuery('');
  }, { ctrlOrMeta: true });

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setQuery('');
    }
  }, [isOpen]);

  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      notify.info('Switched to Light Mode');
    } else {
      document.documentElement.classList.add('dark');
      notify.info('Switched to Dark Mode');
    }
    onClose();
  };

  const handleResetData = () => {
    if (window.confirm('Reset all TaskFlow data to initial demo state?')) {
      storage.clearAll();
      window.location.reload();
    }
  };

  // Static command items
  const items = useMemo(() => [
    // Navigation
    {
      category: 'Navigation',
      id: 'nav-dashboard',
      title: 'Go to Dashboard',
      icon: LayoutDashboard,
      action: () => { navigate('/app/dashboard'); onClose(); },
    },
    {
      category: 'Navigation',
      id: 'nav-tasks',
      title: 'Go to My Tasks',
      icon: CheckSquare,
      action: () => { navigate('/app/my-tasks'); onClose(); },
    },
    {
      category: 'Navigation',
      id: 'nav-projects',
      title: 'Go to Projects',
      icon: FolderKanban,
      action: () => { navigate('/app/projects'); onClose(); },
    },
    {
      category: 'Navigation',
      id: 'nav-calendar',
      title: 'Go to Calendar',
      icon: Calendar,
      action: () => { navigate('/app/calendar'); onClose(); },
    },
    {
      category: 'Navigation',
      id: 'nav-team',
      title: 'Go to Team Directory',
      icon: Users,
      action: () => { navigate('/app/team'); onClose(); },
    },
    {
      category: 'Navigation',
      id: 'nav-reports',
      title: 'Go to Reports & Analytics',
      icon: BarChart3,
      action: () => { navigate('/app/reports'); onClose(); },
    },
    {
      category: 'Navigation',
      id: 'nav-settings',
      title: 'Go to Settings',
      icon: Settings,
      action: () => { navigate('/app/settings'); onClose(); },
    },

    // Quick Actions
    {
      category: 'Actions',
      id: 'action-task',
      title: 'Create new task',
      badge: 'C',
      icon: Plus,
      action: () => { onClose(); onOpenCreateTask?.(); },
    },
    {
      category: 'Actions',
      id: 'action-project',
      title: 'Create new project',
      badge: 'P',
      icon: FolderKanban,
      action: () => { onClose(); onOpenCreateProject?.(); },
    },
    {
      category: 'Actions',
      id: 'action-theme',
      title: 'Toggle Light / Dark mode',
      icon: Moon,
      action: toggleDarkMode,
    },
    {
      category: 'Actions',
      id: 'action-reset',
      title: 'Reset demo data to default',
      icon: RotateCcw,
      action: handleResetData,
    },
    {
      category: 'Actions',
      id: 'action-logout',
      title: 'Log out of TaskFlow',
      icon: LogOut,
      action: () => { onClose(); logout(); },
    },

    // Projects Quick Links
    {
      category: 'Projects',
      id: 'proj-1',
      title: 'Core Mobile App (iOS / Android)',
      icon: FolderKanban,
      action: () => { navigate('/app/projects/proj-1'); onClose(); },
    },
    {
      category: 'Projects',
      id: 'proj-2',
      title: 'Website Redesign & Brand Refresh',
      icon: FolderKanban,
      action: () => { navigate('/app/projects/proj-2'); onClose(); },
    },
    {
      category: 'Projects',
      id: 'proj-3',
      title: 'API Infrastructure & Observability',
      icon: FolderKanban,
      action: () => { navigate('/app/projects/proj-3'); onClose(); },
    },
  ], [navigate, logout, onClose, onOpenCreateTask, onOpenCreateProject]);

  // Filter items by query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const lower = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower)
    );
  }, [items, query]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e) {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200/90 bg-white shadow-soft-xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden z-10 animate-scaleIn">
        {/* Search input bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">
              No matching commands or pages found.
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/70 dark:text-brand-300'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/60 dark:text-brand-300'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="truncate">{item.title}</span>
                  </div>

                  <span className="text-[10px] text-slate-400 font-normal uppercase tracking-wider shrink-0 ml-2">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 bg-slate-50/60 text-[11px] text-slate-400 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-slate-200 dark:bg-slate-800 px-1 py-0.5 text-[10px]">↑</kbd>
              <kbd className="rounded bg-slate-200 dark:bg-slate-800 px-1 py-0.5 text-[10px]">↓</kbd> to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-slate-200 dark:bg-slate-800 px-1 py-0.5 text-[10px]">↵</kbd> to select
            </span>
          </div>
          <span className="flex items-center gap-1 text-brand-600 dark:text-brand-400 font-semibold">
            <Sparkles className="h-3 w-3" /> TaskFlow SpeedOS
          </span>
        </div>
      </div>
    </div>
  );
}
