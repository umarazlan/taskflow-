import React from 'react';
import { Card, Avatar } from '../../../components/ui';
import { CheckCircle2, MessageSquare, ArrowRight, Clock, Plus } from 'lucide-react';
import { INITIAL_USERS } from '../../../data/seedData';

const MOCK_ACTIVITIES = [
  { id: 'act-1', user: INITIAL_USERS[1], action: 'moved', target: 'Biometric FaceID / Fingerprint auth flow', to: 'In Progress', time: '15m ago' },
  { id: 'act-2', user: INITIAL_USERS[0], action: 'completed', target: 'Setup React Router v6 nested routes and guards', to: 'Done', time: '1h ago' },
  { id: 'act-3', user: INITIAL_USERS[3], action: 'commented on', target: 'Hero section interactive Kanban teaser component', to: '', time: '3h ago' },
  { id: 'act-4', user: INITIAL_USERS[2], action: 'created task', target: 'Offline sqlite queue for unsent comments', to: 'Backlog', time: '5h ago' },
  { id: 'act-5', user: INITIAL_USERS[5], action: 'deployed release', target: 'v2.4.0 Sprint Release', to: 'Production', time: '1d ago' },
];

export function ProjectActivityTab() {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Project Activity Audit Log
        </h3>
        <p className="text-xs text-slate-400">Chronological history of changes, commits, and comments</p>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {MOCK_ACTIVITIES.map((item) => (
          <div key={item.id} className="relative flex items-start gap-3 text-xs">
            {/* Timeline dot */}
            <span className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-brand-500 ring-4 ring-white dark:ring-slate-900" />

            <Avatar name={item.user.name} src={item.user.avatar} size="xs" />

            <div className="flex-1">
              <p className="text-slate-800 dark:text-slate-200 leading-snug">
                <span className="font-semibold text-slate-900 dark:text-white">{item.user.name}</span>{' '}
                {item.action}{' '}
                <span className="font-medium text-brand-600 dark:text-brand-400">"{item.target}"</span>
                {item.to && (
                  <span className="text-slate-400"> &rarr; {item.to}</span>
                )}
              </p>
              <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Clock className="h-2.5 w-2.5" /> {item.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
