import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Card, Button, Select, Badge, notify } from '../../components/ui';
import { INITIAL_PROJECTS } from '../../data/mockData';

// Chart datasets
const BURNDOWN_DATA = [
  { day: 'Day 1', ideal: 100, actual: 100 },
  { day: 'Day 3', ideal: 85, actual: 88 },
  { day: 'Day 5', ideal: 70, actual: 72 },
  { day: 'Day 7', ideal: 55, actual: 50 },
  { day: 'Day 9', ideal: 40, actual: 34 },
  { day: 'Day 11', ideal: 25, actual: 20 },
  { day: 'Day 14', ideal: 0, actual: 5 },
];

const VELOCITY_DATA = [
  { sprint: 'Sprint 20', committed: 45, completed: 42 },
  { sprint: 'Sprint 21', committed: 50, completed: 48 },
  { sprint: 'Sprint 22', committed: 55, completed: 52 },
  { sprint: 'Sprint 23', committed: 60, completed: 58 },
  { sprint: 'Sprint 24', committed: 65, completed: 64 },
];

const PRIORITY_DATA = [
  { priority: 'Urgent', count: 4, fill: '#f43f5e' },
  { priority: 'High', count: 12, fill: '#f59e0b' },
  { priority: 'Medium', count: 20, fill: '#6366f1' },
  { priority: 'Low', count: 9, fill: '#94a3b8' },
];

const TIME_PER_PROJECT_DATA = [
  { name: 'Core Mobile App', hours: 48, fill: '#6366f1' },
  { name: 'Website Redesign', hours: 32, fill: '#ec4899' },
  { name: 'API Infrastructure', hours: 56, fill: '#10b981' },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('30d');
  const [selectedProject, setSelectedProject] = useState('all');

  const handleExportCSV = () => {
    // Generate CSV content
    const headers = ['Sprint/Period', 'Committed Points', 'Completed Points', 'Completion %'];
    const rows = VELOCITY_DATA.map((d) => [
      d.sprint,
      d.committed,
      d.completed,
      `${Math.round((d.completed / d.committed) * 100)}%`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `taskflow_velocity_report_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notify.success('Velocity report CSV downloaded successfully!');
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* 1. Header & Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Sprint Reports & Analytics
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Track velocity, burndown performance, throughput capacity, and time distribution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-36">
            <Select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              options={[
                { label: 'All Projects', value: 'all' },
                ...INITIAL_PROJECTS.map((p) => ({ label: p.name, value: p.id })),
              ]}
            />
          </div>

          <div className="w-32">
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              options={[
                { label: 'Last 7 Days', value: '7d' },
                { label: 'Last 30 Days', value: '30d' },
                { label: 'This Quarter', value: 'quarter' },
              ]}
            />
          </div>

          <Button
            variant="outline"
            size="md"
            onClick={handleExportCSV}
            leftIcon={Download}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 space-y-1">
          <p className="text-xs text-slate-400">Average Velocity</p>
          <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">58 pts</p>
          <p className="text-[11px] text-emerald-600 font-semibold">+12% vs last quarter</p>
        </Card>

        <Card className="p-5 space-y-1">
          <p className="text-xs text-slate-400">Average Cycle Time</p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">3.2 days</p>
          <p className="text-[11px] text-emerald-600 font-semibold">-0.8d faster delivery</p>
        </Card>

        <Card className="p-5 space-y-1">
          <p className="text-xs text-slate-400">Overall Completion Rate</p>
          <p className="text-2xl font-extrabold text-emerald-600">96.4%</p>
          <p className="text-[11px] text-slate-400">Commitment accuracy</p>
        </Card>

        <Card className="p-5 space-y-1">
          <p className="text-xs text-slate-400">Total Hours Logged</p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">136 hrs</p>
          <p className="text-[11px] text-brand-600 font-semibold">Sprint 24</p>
        </Card>
      </div>

      {/* 3. Charts Grid Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Burndown Chart */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Sprint Burndown Curve
              </h3>
              <p className="text-xs text-slate-400">Ideal vs actual remaining story points</p>
            </div>
            <Badge variant="primary" size="sm">Sprint 24</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={BURNDOWN_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="ideal" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} name="Ideal Guideline" />
                <Line type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={3} name="Actual Remaining" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Velocity Bar Chart */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Historical Sprint Velocity
              </h3>
              <p className="text-xs text-slate-400">Committed points vs actual shipped</p>
            </div>
            <Badge variant="success" size="sm">+9% Trend</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VELOCITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="sprint" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="committed" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Committed" />
                <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 4. Charts Grid Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time distribution by project */}
        <Card className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Time Spent per Initiative
            </h3>
            <p className="text-xs text-slate-400">Logged engineering and design hours</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={TIME_PER_PROJECT_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  dataKey="hours"
                  paddingAngle={5}
                >
                  {TIME_PER_PROJECT_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Priority breakdown bar */}
        <Card className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Deliverables by Priority
            </h3>
            <p className="text-xs text-slate-400">Urgency classification of active roadmap</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PRIORITY_DATA} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <XAxis type="number" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis dataKey="priority" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]}>
                  {PRIORITY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
