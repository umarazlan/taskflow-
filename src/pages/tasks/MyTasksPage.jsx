import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  Card,
  Button,
  Input,
  Select,
  Badge,
  Avatar,
  EmptyState,
  notify,
} from '../../components/ui';
import { taskService } from '../../services/taskService';
import { TaskDetailDrawer } from '../../components/tasks/TaskDetailDrawer';
import { INITIAL_PROJECTS } from '../../data/mockData';

export default function MyTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [quickTitle, setQuickTitle] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  // Collapsed groups state
  const [collapsedGroups, setCollapsedGroups] = useState({
    overdue: false,
    today: false,
    thisWeek: false,
    later: false,
    noDate: false,
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch {
      notify.error('Failed to load tasks');
    }
  };

  const toggleGroup = (groupKey) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const handleToggleComplete = async (taskId, currentStatus) => {
    const isDone = currentStatus === 'done';
    const newStatus = isDone ? 'todo' : 'done';
    const newCol = isDone ? 'col-todo' : 'col-done';

    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus, columnId: newCol } : t))
    );

    if (!isDone) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
      notify.success('Task marked completed! 🎉');
    }

    try {
      await taskService.updateTask(taskId, { status: newStatus, columnId: newCol });
    } catch {
      // Revert if error
    }
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    try {
      const created = await taskService.createTask({
        title: quickTitle.trim(),
        projectId: projectFilter !== 'all' ? projectFilter : 'proj-1',
        columnId: 'col-todo',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0],
      });
      setTasks([created, ...tasks]);
      setQuickTitle('');
      notify.success(`Task "${created.title}" added to My Tasks!`);
    } catch {
      notify.error('Failed to add task');
    }
  };

  const handleUpdateTask = async (id, updates) => {
    try {
      const updated = await taskService.updateTask(id, updates);
      setTasks(tasks.map((t) => (t.id === id ? updated : t)));
      if (selectedTask?.id === id) setSelectedTask(updated);
    } catch {
      notify.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
      setSelectedTask(null);
      notify.success('Task deleted');
    } catch {
      notify.error('Failed to delete task');
    }
  };

  // Group tasks into Overdue, Today, This Week, Later, No Date
  const groupedTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];

    const filtered = tasks.filter((t) => {
      const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchProject = projectFilter === 'all' || t.projectId === projectFilter;
      return matchSearch && matchPriority && matchStatus && matchProject;
    });

    const groups = {
      overdue: [],
      today: [],
      thisWeek: [],
      later: [],
      noDate: [],
    };

    filtered.forEach((t) => {
      if (!t.dueDate) {
        groups.noDate.push(t);
      } else if (t.dueDate < today && t.status !== 'done') {
        groups.overdue.push(t);
      } else if (t.dueDate === today) {
        groups.today.push(t);
      } else if (t.dueDate > today && t.dueDate <= '2026-11-20') {
        groups.thisWeek.push(t);
      } else {
        groups.later.push(t);
      }
    });

    return groups;
  }, [tasks, searchQuery, priorityFilter, statusFilter, projectFilter]);

  const groupConfigs = [
    { key: 'overdue', title: 'Overdue Tasks', color: 'text-rose-600', badgeColor: 'danger', icon: AlertTriangle },
    { key: 'today', title: 'Due Today', color: 'text-brand-600', badgeColor: 'primary', icon: Clock },
    { key: 'thisWeek', title: 'This Week', color: 'text-sky-600', badgeColor: 'info', icon: Calendar },
    { key: 'later', title: 'Later', color: 'text-slate-600 dark:text-slate-300', badgeColor: 'default', icon: Calendar },
    { key: 'noDate', title: 'No Due Date', color: 'text-slate-400', badgeColor: 'default', icon: CheckSquare },
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Tasks
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Personal deliverables, assignments, and deadlines grouped by urgency.
          </p>
        </div>

        {/* Quick Add Bar */}
        <form onSubmit={handleQuickAdd} className="flex items-center gap-2 max-w-sm w-full">
          <Input
            placeholder="+ Quick add a task to your list..."
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
          />
          <Button type="submit" variant="primary" size="md">
            Add
          </Button>
        </form>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="w-full sm:w-60">
          <Input
            placeholder="Search tasks..."
            leftIcon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="w-32">
            <Select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              options={[
                { label: 'All Projects', value: 'all' },
                ...INITIAL_PROJECTS.map((p) => ({ label: p.name, value: p.id })),
              ]}
            />
          </div>

          <div className="w-28">
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              options={[
                { label: 'All Priorities', value: 'all' },
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' },
                { label: 'Urgent', value: 'urgent' },
              ]}
            />
          </div>

          <div className="w-28">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { label: 'All Statuses', value: 'all' },
                { label: 'To Do', value: 'todo' },
                { label: 'In Progress', value: 'in-progress' },
                { label: 'Done', value: 'done' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Grouped Sections */}
      <div className="space-y-4">
        {groupConfigs.map(({ key, title, color, badgeColor, icon: Icon }) => {
          const list = groupedTasks[key];
          const isCollapsed = collapsedGroups[key];

          return (
            <Card key={key} className="overflow-hidden">
              {/* Group Header Button */}
              <button
                type="button"
                onClick={() => toggleGroup(key)}
                className="w-full flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-slate-100/70 dark:bg-slate-800/40 dark:hover:bg-slate-800/60 transition-colors cursor-pointer text-left border-b border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                  <Icon className={`h-4 w-4 ${color}`} />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {title}
                  </span>
                  <Badge variant={badgeColor} size="sm">
                    {list.length}
                  </Badge>
                </div>
              </button>

              {/* Group Tasks List */}
              {!isCollapsed && (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {list.length === 0 ? (
                    <p className="p-4 text-center text-xs text-slate-400 italic">
                      No tasks in this section.
                    </p>
                  ) : (
                    list.map((task) => {
                      const isDone = task.status === 'done';
                      const proj = INITIAL_PROJECTS.find((p) => p.id === task.projectId);

                      return (
                        <div
                          key={task.id}
                          className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <button
                              type="button"
                              onClick={() => handleToggleComplete(task.id, task.status)}
                              className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center transition-all ${
                                isDone
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'border-slate-300 dark:border-slate-700 hover:border-brand-500'
                              }`}
                            >
                              {isDone && <CheckSquare className="h-3 w-3 stroke-[3]" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => setSelectedTask(task)}
                              className={`text-xs font-semibold hover:text-brand-600 transition-colors text-left truncate ${
                                isDone
                                  ? 'line-through text-slate-400'
                                  : 'text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              {task.title}
                            </button>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 text-xs">
                            {proj && (
                              <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                {proj.name}
                              </span>
                            )}
                            <Badge
                              variant={task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : 'primary'}
                              size="sm"
                            >
                              {task.priority}
                            </Badge>
                            <span className="text-slate-400 text-[11px] hidden sm:block">
                              {task.dueDate || 'No date'}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Task Detail Drawer */}
      <TaskDetailDrawer
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
}
