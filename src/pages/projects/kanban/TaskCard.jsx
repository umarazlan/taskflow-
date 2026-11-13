import React from 'react';
import {
  Calendar,
  CheckSquare,
  MessageSquare,
  Paperclip,
  Clock,
  MoreHorizontal,
} from 'lucide-react';
import { Badge, Avatar } from '../../../components/ui';
import { INITIAL_USERS } from '../../../data/seedData';

const priorityBadges = {
  urgent: 'danger',
  high: 'warning',
  medium: 'primary',
  low: 'default',
};

export function TaskCard({ task, onOpenDetail, isDragging }) {
  const assignee = INITIAL_USERS.find((u) => u.id === task.assigneeId) || INITIAL_USERS[0];
  const subtasksCount = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;

  return (
    <div
      onClick={() => onOpenDetail(task)}
      className={`rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-subtle transition-all cursor-pointer ${
        isDragging
          ? 'shadow-soft-xl ring-2 ring-brand-500 rotate-1 border-brand-500 scale-105 z-50'
          : 'hover:border-brand-400 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900/90'
      }`}
    >
      {/* Priority and Tags Row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <Badge variant={priorityBadges[task.priority] || 'default'} size="sm">
          {task.priority}
        </Badge>
        {task.labels && task.labels[0] && (
          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
            {task.labels[0]}
          </span>
        )}
      </div>

      {/* Task Title */}
      <h4 className="text-xs font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2">
        {task.title}
      </h4>

      {/* Subtasks Progress */}
      {subtasksCount > 0 && (
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <CheckSquare className="h-3 w-3 text-brand-600 dark:text-brand-400" />
          <span>
            {completedSubtasks}/{subtasksCount}
          </span>
          <div className="h-1 w-12 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ml-1">
            <div
              className="h-full bg-brand-500 rounded-full"
              style={{ width: `${(completedSubtasks / subtasksCount) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Bottom Metadata: Due Date & Assignee Avatar */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          {task.dueDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {task.dueDate.slice(5)}
            </span>
          )}
          {task.commentsCount > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {task.commentsCount}
            </span>
          )}
          {task.attachmentsCount > 0 && (
            <span className="flex items-center gap-1">
              <Paperclip className="h-3 w-3" />
              {task.attachmentsCount}
            </span>
          )}
        </div>

        <Avatar
          name={assignee.name}
          src={assignee.avatar}
          size="xs"
          presence={task.status === 'in-progress' ? 'online' : undefined}
        />
      </div>
    </div>
  );
}
