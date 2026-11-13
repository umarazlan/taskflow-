import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Plus,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { Card, Button, Badge, ProgressBar, Avatar, notify } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { projectService } from '../../services/projectService';
import { taskService } from '../../services/taskService';
import { INITIAL_USERS } from '../../data/seedData';

// Chart sample data
const COMPLETION_TREND_DATA = [
  { day: 'Mon', completed: 4, created: 6 },
  { day: 'Tue', completed: 7, created: 5 },
  { day: 'Wed', completed: 9, created: 8 },
  { day: 'Thu', completed: 12, created: 7 },
  { day: 'Fri', completed: 15, created: 10 },
  { day: 'Sat', completed: 18, created: 4 },
  { day: 'Sun', completed: 21, created: 3 },
];

const STATUS_DONUT_DATA = [
  { name: 'Done', value: 18, color: '#10b981' },
  { name: 'In Progress', value: 8, color: '#6366f1' },
  { name: 'In Review', value: 5, color: '#f59e0b' },
  { name: 'To Do', value: 7, color: '#64748b' },
];

const WORKLOAD_BAR_DATA = [
  { name: 'Sarah', tasks: 6 },
  { name: 'Alex (You)', tasks: 9 },
  { name: 'Marcus', tasks: 5 },
  { name: 'Emily', tasks: 7 },
  { name: 'David', tasks: 4 },
  { name: 'Elena', tasks: 3 },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [quickTitle, setQuickTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [projList, taskList] = await Promise.all([
          projectService.getProjects(),
          taskService.getAllTasks(),
        ]);
        setProjects(projList);
        setTasks(taskList);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleQuickAddTask = async (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    try {
      const newTask = await taskService.createTask({
        title: quickTitle,
        projectId: projects[0]?.id || 'proj-1',
        columnId: 'col-todo',
        priority: 'medium',
      });
      setTasks([newTask, ...tasks]);
      setQuickTitle('');
      notify.success(`Task "${newTask.title}" added to backlog!`);
    } catch {
      notify.error('Failed to create task');
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'done' ? 'todo' : 'done';
    const newCol = newStatus === 'done' ? 'col-done' : 'col-todo';

    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus, columnId: newCol } : t))
    );

    try {
      await taskService.updateTask(taskId, { status: newStatus, columnId: newCol });
      notify.success(newStatus === 'done' ? 'Task marked completed! 🎉' : 'Task reopened');
    } catch {
      // Revert if error
    }
  };

  const todayStr = format(new Date(), 'EEEE, MMMM d, yyyy');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header Greeting & Quick Add */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Good day, {user?.name ? user.name.split(' ')[0] : 'there'} 👋
            </h1>
            <Badge variant="primary" size="sm" dot>Sprint Active</Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {todayStr} &bull; Here's what's happening across your active workspace.
          </p>
        </div>

        {/* Quick Add Bar */}
        <form onSubmit={handleQuickAddTask} className="flex items-center gap-2 max-w-md w-full">
          <input
            type="text"
            placeholder="Quick add a task for today..."
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            className="flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
          <Button type="submit" variant="primary" size="md" leftIcon={Plus} className="shrink-0">
            Add
          </Button>
        </form>
      </div>

      {/* 2. Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center justify-between shadow-soft hover:shadow-soft-md transition-shadow">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Projects</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{projects.length}</p>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
              <TrendingUp className="h-3 w-3" />
              <span>+1 active this month</span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/70 dark:text-brand-400 flex items-center justify-center">
            <FolderKanban className="h-6 w-6" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between shadow-soft hover:shadow-soft-md transition-shadow">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Due Today</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">4</p>
            <div className="flex items-center gap-1 text-[11px] text-brand-600 font-semibold">
              <Clock className="h-3 w-3" />
              <span>2 in progress now</span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/70 dark:text-sky-400 flex items-center justify-center">
            <Calendar className="h-6 w-6" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between shadow-soft hover:shadow-soft-md transition-shadow">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Overdue Tasks</p>
            <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">2</p>
            <div className="flex items-center gap-1 text-[11px] text-rose-500 font-semibold">
              <AlertTriangle className="h-3 w-3" />
              <span>Requires attention</span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/70 dark:text-rose-400 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between shadow-soft hover:shadow-soft-md transition-shadow">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Completed This Week</p>
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">18</p>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
              <ArrowUpRight className="h-3 w-3" />
              <span>+24% vs last week</span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </Card>
      </div>

      {/* 3. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Velocity Trend (AreaChart) */}
        <Card className="p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Task Velocity & Completion
              </h3>
              <p className="text-xs text-slate-400">Cumulative throughput over the last 7 days</p>
            </div>
            <Badge variant="success" size="sm" dot>+18 Velocity</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={COMPLETION_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Area type="monotone" dataKey="completed" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCompleted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Status Breakdown (Donut) */}
        <Card className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Tasks by Status
            </h3>
            <p className="text-xs text-slate-400">Distribution across current board</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={STATUS_DONUT_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {STATUS_DONUT_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {STATUS_DONUT_DATA.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 dark:text-slate-300 truncate">{item.name}:</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 4. Upcoming Tasks & Workload Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Upcoming Tasks (2 cols) */}
        <Card className="p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                My Upcoming Deliverables
              </h3>
              <p className="text-xs text-slate-400">High priority tasks assigned to you</p>
            </div>
            <Link to="/app/my-tasks">
              <Button variant="ghost" size="xs" rightIcon={ChevronRight}>
                View all tasks
              </Button>
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {tasks.slice(0, 5).map((task) => {
              const isDone = task.status === 'done';

              return (
                <div
                  key={task.id}
                  className="py-3 flex items-center justify-between gap-3 group hover:bg-slate-50/50 dark:hover:bg-slate-800/40 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => handleToggleTask(task.id, task.status)}
                      className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-300 dark:border-slate-700 hover:border-brand-500'
                      }`}
                    >
                      {isDone && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </button>
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-semibold truncate ${
                          isDone
                            ? 'line-through text-slate-400'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="uppercase font-medium text-slate-500">{task.priority}</span>
                        <span>&bull;</span>
                        <span>Due {task.dueDate || 'Tomorrow'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {task.labels && task.labels[0] && (
                      <Badge variant="primary" size="sm">
                        {task.labels[0]}
                      </Badge>
                    )}
                    <Avatar name={user?.name || 'You'} size="xs" />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Right: Team Workload (BarChart) */}
        <Card className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Team Workload
            </h3>
            <p className="text-xs text-slate-400">Assigned task distribution</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WORKLOAD_BAR_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="tasks" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 5. Active Projects Progress Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Active Project Portfolios
            </h3>
            <p className="text-xs text-slate-400">Current progress towards release milestones</p>
          </div>
          <Link to="/app/projects">
            <Button variant="outline" size="sm" rightIcon={ChevronRight}>
              All Projects ({projects.length})
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projects.map((proj) => (
            <Card key={proj.id} className="p-5 space-y-4 hover:shadow-soft-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{proj.icon}</span>
                  <div>
                    <Link
                      to={`/app/projects/${proj.id}`}
                      className="text-sm font-bold text-slate-900 dark:text-white hover:text-brand-600 transition-colors"
                    >
                      {proj.name}
                    </Link>
                    <p className="text-[11px] text-slate-400">Due {proj.dueDate}</p>
                  </div>
                </div>
                <Badge variant={proj.progress > 70 ? 'success' : 'primary'} size="sm">
                  {proj.progress}%
                </Badge>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {proj.description}
              </p>

              <ProgressBar value={proj.progress} size="sm" />

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400 text-[11px]">4 contributors</span>
                <Link
                  to={`/app/projects/${proj.id}`}
                  className="font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-1 hover:underline text-[11px]"
                >
                  Open Board &rarr;
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
