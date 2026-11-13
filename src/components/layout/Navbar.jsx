import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Plus,
  Sun,
  Moon,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  FolderKanban,
  CheckSquare,
} from 'lucide-react';
import { Button, Avatar, Dropdown, DropdownItem, DropdownDivider, DropdownLabel, notify } from '../ui';
import { useAuth } from '../../context/AuthContext';
import { Breadcrumbs } from './Breadcrumbs';
import { NotificationsDropdown } from './NotificationsDropdown';

export function Navbar({
  onToggleSidebar,
  onOpenCommandPalette,
  onOpenCreateTask,
  onOpenCreateProject,
  onOpenShortcuts,
}) {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  );

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      notify.info('Switched to Dark Mode');
    } else {
      document.documentElement.classList.remove('dark');
      notify.info('Switched to Light Mode');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Breadcrumbs />
      </div>

      {/* Right: Search, + Create, Notifications, Theme, User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search trigger */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-300 hover:text-slate-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:border-slate-700 transition-colors w-52 md:w-64"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1 text-left truncate">Search or jump to...</span>
          <kbd className="rounded bg-white dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            ⌘K
          </kbd>
        </button>

        {/* Quick mobile search icon */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="sm:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          aria-label="Search"
        >
          <Search className="h-4.5 w-4.5" />
        </button>

        {/* Create Dropdown */}
        <Dropdown
          align="right"
          trigger={
            <Button variant="primary" size="sm" leftIcon={Plus}>
              <span className="hidden sm:inline">Create</span>
            </Button>
          }
        >
          <DropdownLabel>Create New</DropdownLabel>
          <DropdownItem icon={CheckSquare} onClick={onOpenCreateTask}>
            New Task
          </DropdownItem>
          <DropdownItem icon={FolderKanban} onClick={onOpenCreateProject}>
            New Project
          </DropdownItem>
        </Dropdown>

        {/* Notifications Dropdown */}
        <NotificationsDropdown />

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

        {/* User Menu Dropdown */}
        <Dropdown
          align="right"
          trigger={
            <div className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Avatar
                name={user?.name || 'User'}
                src={user?.avatar}
                size="sm"
                presence="online"
              />
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
            </div>
          }
        >
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {user?.name || 'Alex Morgan'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {user?.email || 'demo@taskflow.com'}
            </p>
          </div>

          <DropdownItem icon={User} onClick={() => notify.info('Navigating to profile')}>
            <Link to="/app/settings" className="w-full">Profile & Account</Link>
          </DropdownItem>
          <DropdownItem icon={Settings} onClick={() => notify.info('Navigating to workspace settings')}>
            <Link to="/app/settings" className="w-full">Workspace Settings</Link>
          </DropdownItem>
          <DropdownItem icon={HelpCircle} onClick={onOpenShortcuts}>
            Keyboard Shortcuts (?)
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem icon={LogOut} danger onClick={logout}>
            Sign Out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
