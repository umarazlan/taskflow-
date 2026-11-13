import React from 'react';
import { Card, ProgressBar, Avatar, Badge } from '../../../components/ui';
import { CheckCircle2, Clock, Users, Target, Flag } from 'lucide-react';
import { INITIAL_USERS } from '../../../data/seedData';

export function ProjectOverviewTab({ project, tasks }) {
  const completedCount = tasks.filter((t) => t.status === 'done').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length;
  const totalLoggedHours = tasks.reduce((sum, t) => sum + (t.loggedHours || 0), 0);

  return (
    <div className="space-y-6">
      {/* Key Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <p className="text-xs text-slate-400">Total Deliverables</p>
          <p className="text-xl font-bold">{tasks.length} tasks</p>
          <p className="text-[11px] text-emerald-600 font-semibold">{completedCount} completed</p>
        </Card>

        <Card className="p-4 space-y-1">
          <p className="text-xs text-slate-400">Active In Progress</p>
          <p className="text-xl font-bold text-brand-600">{inProgressCount} tasks</p>
          <p className="text-[11px] text-slate-400">Current sprint focus</p>
        </Card>

        <Card className="p-4 space-y-1">
          <p className="text-xs text-slate-400">Time Tracked</p>
          <p className="text-xl font-bold">{totalLoggedHours} hours</p>
          <p className="text-[11px] text-slate-400">Logged across team</p>
        </Card>

        <Card className="p-4 space-y-1">
          <p className="text-xs text-slate-400">Target Launch</p>
          <p className="text-xl font-bold">{project.dueDate || 'Dec 15, 2026'}</p>
          <p className="text-[11px] text-brand-600 font-semibold">On track</p>
        </Card>
      </div>

      {/* Description & Milestones Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Project Scope & Deliverables
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {project.description}
          </p>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Key Project Milestones
            </h4>
            <div className="space-y-2.5">
              {[
                { title: 'Milestone 1: Design System & Wireframes', date: 'Oct 20', done: true },
                { title: 'Milestone 2: Alpha Release with Core Authentication', date: 'Nov 12', done: true },
                { title: 'Milestone 3: Beta Customer Testing with 500 users', date: 'Nov 30', done: false },
                { title: 'Milestone 4: General Availability Production Launch', date: 'Dec 15', done: false },
              ].map((m, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className={`h-4 w-4 ${m.done ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'}`} />
                    <span className={m.done ? 'line-through text-slate-400' : 'font-medium'}>{m.title}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{m.date}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Assigned Team Members */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Project Squad
            </h3>
            <Badge variant="primary" size="sm">4 members</Badge>
          </div>

          <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
            {INITIAL_USERS.slice(0, 4).map((member) => (
              <div key={member.id} className="pt-2.5 first:pt-0 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Avatar name={member.name} src={member.avatar} size="sm" presence="online" />
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{member.name}</p>
                    <p className="text-[10px] text-slate-400">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
