import React, { useState, useEffect, useMemo } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addDays,
  subDays,
} from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  Card,
  Button,
  Badge,
  Modal,
  Input,
  Select,
  notify,
} from '../../components/ui';
import { taskService } from '../../services/taskService';
import { TaskDetailDrawer } from '../../components/tasks/TaskDetailDrawer';
import { INITIAL_PROJECTS } from '../../data/mockData';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'week'
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  // Quick create task modal for a specific day
  const [createModalDate, setCreateModalDate] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskProject, setNewTaskProject] = useState('proj-1');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch {
      notify.error('Failed to load calendar tasks');
    }
  };

  // Month days generation
  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  // Week days generation
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  }, [currentDate]);

  // HTML5 Drag and drop to reschedule
  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('text/plain', task.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetDay) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;

    const formattedDate = format(targetDay, 'yyyy-MM-dd');
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, dueDate: formattedDate } : t));
    setTasks(updated);

    try {
      await taskService.updateTask(taskId, { dueDate: formattedDate });
      notify.success(`Rescheduled to ${format(targetDay, 'MMM d, yyyy')}! 📅`);
    } catch {
      notify.error('Failed to reschedule task');
    }
  };

  const handleCreateOnDate = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !createModalDate) return;

    try {
      const created = await taskService.createTask({
        title: newTaskTitle.trim(),
        projectId: newTaskProject,
        dueDate: format(createModalDate, 'yyyy-MM-dd'),
        priority: 'medium',
        columnId: 'col-todo',
      });
      setTasks([created, ...tasks]);
      setNewTaskTitle('');
      setCreateModalDate(null);
      notify.success(`Task scheduled for ${format(createModalDate, 'MMM d')}!`);
    } catch {
      notify.error('Failed to schedule task');
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
      notify.success('Task removed');
    } catch {
      notify.error('Failed to delete task');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Schedule & Calendar
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Plot sprint deadlines, drag cards to reschedule, and plan team milestones.
          </p>
        </div>

        {/* View switcher & Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-subtle">
            <button
              type="button"
              onClick={() => setCurrentDate(viewMode === 'month' ? subMonths(currentDate, 1) : subDays(currentDate, 7))}
              className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentDate(new Date())}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setCurrentDate(viewMode === 'month' ? addMonths(currentDate, 1) : addDays(currentDate, 7))}
              className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <span className="text-sm font-bold text-slate-800 dark:text-slate-200 min-w-36 text-center">
            {format(currentDate, 'MMMM yyyy')}
          </span>

          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'month'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-subtle'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'week'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-subtle'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Main Calendar Grid */}
      <Card className="overflow-hidden shadow-soft-lg">
        {/* Day name headers */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 text-center py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>

        {/* Days grid */}
        {viewMode === 'month' ? (
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-950/40">
            {monthDays.map((day) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const dayTasks = tasks.filter((t) => t.dueDate === dateKey);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toISOString()}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, day)}
                  className={`min-h-[110px] p-2 flex flex-col justify-between transition-colors group hover:bg-slate-50/50 dark:hover:bg-slate-900/60 ${
                    !isCurrentMonth ? 'bg-slate-50/40 dark:bg-slate-900/30 opacity-40' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`h-6 w-6 text-xs flex items-center justify-center rounded-full font-bold ${
                        isToday
                          ? 'bg-brand-600 text-white shadow-soft'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>

                    <button
                      type="button"
                      onClick={() => setCreateModalDate(day)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-brand-600 transition-opacity"
                      title="Add task on this date"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Tasks on this day */}
                  <div className="space-y-1 flex-1 overflow-y-auto max-h-20 no-scrollbar">
                    {dayTasks.map((task) => {
                      const proj = INITIAL_PROJECTS.find((p) => p.id === task.projectId);

                      return (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task)}
                          onClick={() => setSelectedTask(task)}
                          className="px-2 py-1 rounded-md text-[11px] font-medium text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 truncate cursor-grab active:cursor-grabbing hover:border-brand-500 shadow-subtle flex items-center gap-1.5 bg-white dark:bg-slate-900"
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: proj?.color || '#6366f1' }}
                          />
                          <span className="truncate">{task.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Week View */
          <div className="grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800 min-h-[450px]">
            {weekDays.map((day) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const dayTasks = tasks.filter((t) => t.dueDate === dateKey);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toISOString()}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, day)}
                  className="p-3 flex flex-col space-y-3"
                >
                  <div className="text-center pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span
                      className={`inline-block h-7 w-7 text-xs rounded-full font-bold leading-7 ${
                        isToday ? 'bg-brand-600 text-white' : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{format(day, 'EEE')}</p>
                  </div>

                  <div className="space-y-2 flex-1">
                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        onClick={() => setSelectedTask(task)}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-subtle hover:border-brand-500 transition-all cursor-grab space-y-1.5 text-xs"
                      >
                        <Badge variant="primary" size="sm">{task.priority}</Badge>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                          {task.title}
                        </p>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => setCreateModalDate(day)}
                      className="w-full py-1.5 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-400 hover:border-brand-500 hover:text-brand-600"
                    >
                      + Add task
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Date Task Create Modal */}
      <Modal
        isOpen={!!createModalDate}
        onClose={() => setCreateModalDate(null)}
        title={`Schedule Task for ${createModalDate ? format(createModalDate, 'MMM d, yyyy') : ''}`}
        description="Add a deliverable directly into this calendar date."
        footer={
          <>
            <Button variant="outline" size="md" onClick={() => setCreateModalDate(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleCreateOnDate}>
              Schedule Task
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateOnDate} className="space-y-4">
          <Input
            label="Task Title"
            placeholder="e.g. Prepare Sprint 25 retrospective slides"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            required
            autoFocus
          />
          <Select
            label="Assign to Project"
            value={newTaskProject}
            onChange={(e) => setNewTaskProject(e.target.value)}
            options={INITIAL_PROJECTS.map((p) => ({ label: p.name, value: p.id }))}
          />
        </form>
      </Modal>

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
