import React, { useState } from 'react';
import { Check, Trash2, ArrowUpDown, Calendar, CheckSquare } from 'lucide-react';
import { Badge, Avatar, Select, Button, notify } from '../../../components/ui';
import { INITIAL_USERS } from '../../../data/seedData';

export function ProjectListView({ tasks, onUpdateTask, onDeleteTask, onOpenTaskDetail }) {
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);

  const toggleSelectAll = () => {
    if (selectedTaskIds.length === tasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(tasks.map((t) => t.id));
    }
  };

  const toggleSelectOne = (id) => {
    if (selectedTaskIds.includes(id)) {
      setSelectedTaskIds(selectedTaskIds.filter((tId) => tId !== id));
    } else {
      setSelectedTaskIds([...selectedTaskIds, id]);
    }
  };

  const handleBulkComplete = () => {
    selectedTaskIds.forEach((id) => {
      onUpdateTask(id, { status: 'done', columnId: 'col-done' });
    });
    notify.success(`${selectedTaskIds.length} tasks marked as done!`);
    setSelectedTaskIds([]);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedTaskIds.length} selected tasks?`)) {
      selectedTaskIds.forEach((id) => onDeleteTask(id));
      notify.success('Tasks deleted');
      setSelectedTaskIds([]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Bulk actions banner */}
      {selectedTaskIds.length > 0 && (
        <div className="p-3 rounded-xl bg-brand-50 border border-brand-200 dark:bg-brand-950/60 dark:border-brand-800 flex items-center justify-between animate-fadeIn">
          <span className="text-xs font-semibold text-brand-900 dark:text-brand-200">
            {selectedTaskIds.length} tasks selected
          </span>
          <div className="flex items-center gap-2">
            <Button variant="primary" size="xs" onClick={handleBulkComplete}>
              Mark Completed
            </Button>
            <Button variant="danger" size="xs" onClick={handleBulkDelete}>
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Table view */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={tasks.length > 0 && selectedTaskIds.length === tasks.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                  />
                </th>
                <th className="p-3.5">Task Title</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Assignee</th>
                <th className="p-3.5">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {tasks.map((task) => {
                const isSelected = selectedTaskIds.includes(task.id);
                const assignee = INITIAL_USERS.find((u) => u.id === task.assigneeId) || INITIAL_USERS[0];

                return (
                  <tr
                    key={task.id}
                    className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors ${
                      isSelected ? 'bg-brand-50/30 dark:bg-brand-950/20' : ''
                    }`}
                  >
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(task.id)}
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-3.5">
                      <button
                        type="button"
                        onClick={() => onOpenTaskDetail(task)}
                        className="font-semibold text-slate-800 dark:text-slate-200 hover:text-brand-600 text-left truncate max-w-sm block"
                      >
                        {task.title}
                      </button>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={task.status}
                        onChange={(e) => onUpdateTask(task.id, { status: e.target.value })}
                        className="bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-[11px] font-medium"
                      >
                        <option value="backlog">Backlog</option>
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="in-review">In Review</option>
                        <option value="done">Done</option>
                      </select>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={task.priority}
                        onChange={(e) => onUpdateTask(task.id, { priority: e.target.value })}
                        className="bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-[11px] font-medium"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <Avatar name={assignee.name} src={assignee.avatar} size="xs" />
                        <span className="truncate max-w-[120px]">{assignee.name}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-500">
                      {task.dueDate || 'No Date'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
