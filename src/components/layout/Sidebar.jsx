import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Kanban,
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Calendar,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Star,
  Plus,
  LogOut,
  Building,
  Check,
} from 'lucide-react';
import { Avatar, Badge, Dropdown, DropdownItem, DropdownDivider, DropdownLabel, Tooltip } from '../ui';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { path: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/app/my-tasks', label: 'My Tasks', icon: CheckSquare, badge: '5' },
  { path: '/app/projects', label: 'Projects', icon: FolderKanban },
  { path: '/app/calendar', label: 'Calendar', icon: Calendar },
  { path: '/app/team', label: 'Team', icon: Users },
  { path: '/app/reports', label: 'Reports', icon: BarChart3 },
  { path: '/app/settings', label: 'Settings', icon: Settings },
];

const FAVORITE_PROJECTS = [
  { id: 'proj-1', name: 'Core Mobile App', color: '#6366f1' },
  { id: 'proj-2', name: 'Website Redesign', color: '#ec4899' },
  { id: 'proj-3', name: 'API Infrastructure', color: '#10b981' },
];

export function Sidebar({ isCollapsed, onToggleCollapse, isMobile = false, onCloseMobile }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [currentWorkspace, setCurrentWorkspace] = useState('Acme Product Studio');
  const [workspaces, setWorkspaces] = useState([
    'Acme Product Studio',
    'Personal Projects',
    'Client Alpha Labs',
  ]);

  const handleLinkClick = () => {
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      className={`h-full flex flex-col justify-between border-r border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-900 transition-all duration-300 ease-in-out select-none ${
        isCollapsed && !isMobile ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header & Workspace Switcher */}
      <div className="flex flex-col">
        {/* Logo and Collapse Toggle */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
          <Link
            to="/app/dashboard"
            onClick={handleLinkClick}
            className="flex items-center gap-2.5 overflow-hidden"
          >
            <div className="h-9 w-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-soft shrink-0">
              <Kanban className="h-5 w-5" />
            </div>
            {(!isCollapsed || isMobile) && (
              <span className="text-base font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent truncate">
                TaskFlow
              </span>
            )}
          </Link>

          {!isMobile && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          )}
        </div>

        {/* Workspace Switcher */}
        {(!isCollapsed || isMobile) ? (
          <div className="p-3 border-b border-slate-100 dark:border-slate-800">
            <Dropdown
              className="w-full"
              trigger={
                <div className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="h-7 w-7 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-xs shrink-0">
                      ⚡
                    </span>
                    <div className="text-left min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {currentWorkspace}
                      </p>
                      <p className="text-[10px] text-slate-400">Pro Plan &bull; 6 members</p>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                </div>
              }
            >
              <DropdownLabel>Workspaces</DropdownLabel>
              {workspaces.map((ws) => (
                <DropdownItem
                  key={ws}
                  icon={Building}
                  onClick={() => setCurrentWorkspace(ws)}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{ws}</span>
                    {ws === currentWorkspace && <Check className="h-3.5 w-3.5 text-brand-600" />}
                  </div>
                </DropdownItem>
              ))}
              <DropdownDivider />
              <DropdownItem icon={Plus} onClick={() => alert('Opening workspace creator...')}>
                Create new workspace
              </DropdownItem>
            </Dropdown>
          </div>
        ) : (
          <div className="p-3 flex justify-center border-b border-slate-100 dark:border-slate-800">
            <Tooltip content={currentWorkspace} position="right">
              <div className="h-9 w-9 rounded-xl bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-sm cursor-pointer shadow-subtle">
                ⚡
              </div>
            </Tooltip>
          </div>
        )}

        {/* Main Navigation Links */}
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            const content = (
              <NavLink
                to={item.path}
                onClick={handleLinkClick}
                className={({ isActive: navActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                    navActive
                      ? 'bg-brand-600 text-white shadow-soft dark:bg-brand-500 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                  } ${isCollapsed && !isMobile ? 'justify-center px-0' : ''}`
                }
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {(!isCollapsed || isMobile) && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}
                {(!isCollapsed || isMobile) && item.badge && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );

            return isCollapsed && !isMobile ? (
              <Tooltip key={item.path} content={item.label} position="right">
                {content}
              </Tooltip>
            ) : (
              <div key={item.path}>{content}</div>
            );
          })}
        </nav>

        {/* Favorite Projects */}
        {(!isCollapsed || isMobile) && (
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Starred Projects
              </span>
              <Link
                to="/app/projects"
                onClick={handleLinkClick}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <Plus className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-1">
              {FAVORITE_PROJECTS.map((proj) => (
                <NavLink
                  key={proj.id}
                  to={`/app/projects/${proj.id}`}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-slate-200'
                    }`
                  }
                >
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: proj.color }}
                  />
                  <span className="truncate">{proj.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Mini-Profile at the bottom */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
        <div
          className={`flex items-center gap-3 p-1.5 rounded-xl transition-colors ${
            isCollapsed && !isMobile ? 'justify-center' : 'justify-between'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar
              name={user?.name || 'User'}
              src={user?.avatar}
              size="sm"
              presence="online"
            />
            {(!isCollapsed || isMobile) && (
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user?.name || 'Alex Morgan'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {user?.role || 'Product Lead'}
                </p>
              </div>
            )}
          </div>

          {(!isCollapsed || isMobile) && (
            <button
              type="button"
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
