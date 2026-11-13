import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Clock,
  Trash2,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  UserCheck,
} from 'lucide-react';
import { Card, Button, Badge, Avatar, Tabs, EmptyState, notify } from '../../components/ui';
import { INITIAL_USERS } from '../../data/seedData';

const ALL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    actor: INITIAL_USERS[1],
    type: 'assignment',
    title: 'Sarah Chen assigned you to a task',
    detail: 'Implement Kanban drag-and-drop state synchronization',
    project: 'Core Mobile App',
    time: '12 minutes ago',
    read: false,
    isMention: false,
  },
  {
    id: 'notif-2',
    actor: INITIAL_USERS[2],
    type: 'mention',
    title: 'Marcus Johnson mentioned you in a comment',
    detail: '@Alex can you review the Redis cache invalidation logic before we merge?',
    project: 'API Infrastructure',
    time: '45 minutes ago',
    read: false,
    isMention: true,
  },
  {
    id: 'notif-3',
    actor: INITIAL_USERS[3],
    type: 'status',
    title: 'Emily Zhang updated task status',
    detail: 'Hero section interactive Kanban teaser component marked as In Review',
    project: 'Website Redesign',
    time: '2 hours ago',
    read: false,
    isMention: false,
  },
  {
    id: 'notif-4',
    actor: INITIAL_USERS[5],
    type: 'deploy',
    title: 'Elena Rostova deployed a new release',
    detail: 'Sprint 24 production deployment successful with zero rollbacks',
    project: 'Core Mobile App',
    time: '1 day ago',
    read: true,
    isMention: false,
  },
  {
    id: 'notif-5',
    actor: INITIAL_USERS[4],
    type: 'mention',
    title: 'David Kim mentioned you',
    detail: '@Alex QA testing passed on iOS Simulator builds',
    project: 'Core Mobile App',
    time: '2 days ago',
    read: true,
    isMention: true,
  },
];

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(ALL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('all');

  const unreadCount = notifications.filter((n) => !n.read).length;
  const mentionsCount = notifications.filter((n) => n.isMention).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    notify.success('All notifications marked as read');
  };

  const markSingleAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    notify.info('Notification dismissed');
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'mentions') return n.isMention;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Notifications & Activity
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Real-time mentions, task assignments, and deployment updates across your squad.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            leftIcon={CheckCheck}
          >
            Mark all read
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'all', label: 'All', count: notifications.length },
          { id: 'unread', label: 'Unread', count: unreadCount },
          { id: 'mentions', label: 'Mentions', count: mentionsCount },
        ]}
      />

      {/* List */}
      <Card className="overflow-hidden shadow-soft-lg">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="All caught up!"
            description="You don't have any unread notifications right now."
          />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => markSingleAsRead(item.id)}
                className={`p-4 flex items-start justify-between gap-4 transition-colors cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-800/40 ${
                  !item.read ? 'bg-brand-50/30 dark:bg-brand-950/20' : ''
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <Avatar name={item.actor.name} src={item.actor.avatar} size="md" />
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </span>
                      <Badge variant="default" size="sm">
                        {item.project}
                      </Badge>
                      {!item.read && (
                        <span className="h-2 w-2 rounded-full bg-brand-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.detail}
                    </p>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {item.time}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(item.id);
                  }}
                  className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                  title="Dismiss notification"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
