import React from 'react';
import { Badge, Card } from '../../../components/ui';

export function ProjectTimelineView({ tasks, onOpenTaskDetail }) {
  // Sort tasks by due date
  const sortedTasks = [...tasks].sort((a, b) =>
    (a.dueDate || '').localeCompare(b.dueDate || '')
  );

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Sprint Timeline & Dependencies
        </h3>
        <p className="text-xs text-slate-400">
          Gantt-style representation of active work deliverables
        </p>
      </div>

      <div className="space-y-4">
        {sortedTasks.map((task, index) => {
          // Calculate arbitrary visual bar width and offset based on index and estimate
          const widthPercent = Math.min(Math.max((task.estimateHours || 8) * 5, 25), 85);
          const offsetPercent = (index * 7) % 30;

          return (
            <div key={task.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => onOpenTaskDetail(task)}
                  className="font-semibold text-slate-800 dark:text-slate-200 hover:text-brand-600 truncate max-w-sm text-left"
                >
                  {task.title}
                </button>
                <span className="text-[11px] text-slate-400">
                  {task.dueDate ? `Due ${task.dueDate}` : 'No deadline'}
                </span>
              </div>

              {/* Gantt Bar Track */}
              <div className="h-6 w-full bg-slate-100 dark:bg-slate-800 rounded-lg relative overflow-hidden flex items-center px-2">
                <div
                  className={`h-4 rounded-md transition-all flex items-center px-2 text-[10px] font-bold text-white shadow-subtle ${
                    task.status === 'done'
                      ? 'bg-emerald-500'
                      : task.priority === 'urgent'
                      ? 'bg-rose-500'
                      : 'bg-brand-600'
                  }`}
                  style={{
                    width: `${widthPercent}%`,
                    marginLeft: `${offsetPercent}%`,
                  }}
                >
                  <span className="truncate">{task.status.toUpperCase()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
