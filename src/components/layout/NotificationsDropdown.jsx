import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Clock, ExternalLink } from 'lucide-react';
import { Avatar, Badge, Button } from '../ui';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'n-1',
    actor: { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    message: 'assigned you to "Implement Kanban drag-and-drop state"',
    project: 'Core Mobile App',
    time: '10m ago',
    read: false,
  },
  {
    id: 'n-2',
    actor: { name: 'Marcus Johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    message: 'commented on "API Gateway JWT authentication token validation"',
    project: 'API Infrastructure',
    time: '45m ago',
    read: false,
  },
  {
    id: 'n-3',
    actor: { name: 'Emily Zhang', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
    message: 'updated status of "Design Tokens audit" to Completed',
    project: 'Website Redesign',
    time: '2h ago',
    read: false,
  },
  {
    id: 'n-4',
    actor: { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
    message: 'deployed release v2.4.0 to production environment',
    project: 'Core Mobile App',
    time: '1d ago',
    read: true,
  },
];

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = (e) => {
    e.stopPropagation();
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-4.5 w-4.5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200/90 bg-white shadow-soft-xl dark:border-slate-800 dark:bg-slate-900 z-50 overflow-hidden animate-scaleIn origin-top-right">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Notifications
                </h4>
                {unreadCount > 0 && (
                  <Badge variant="primary" size="sm">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-80 overflow-y-auto">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                    !item.read ? 'bg-brand-50/30 dark:bg-brand-950/20' : ''
                  }`}
                >
                  <Avatar name={item.actor.name} src={item.actor.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-snug">
                      <span className="font-semibold text-slate-900 dark:text-white">{item.actor.name}</span>{' '}
                      {item.message}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                      <Badge variant="default" size="sm">{item.project}</Badge>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {item.time}
                      </span>
                    </div>
                  </div>
                  {!item.read && (
                    <span className="h-2 w-2 rounded-full bg-brand-500 shrink-0 mt-1" />
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-center">
              <Link
                to="/app/notifications"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white inline-flex items-center gap-1.5 py-1"
              >
                View all notifications <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
