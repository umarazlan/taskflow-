import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button, Card, Badge, Avatar } from '../../components/ui';
import { LogOut, Sparkles, CheckCircle2 } from 'lucide-react';

export default function DashboardPlaceholder() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12 text-slate-900 dark:text-slate-100">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <Avatar name={user?.name || 'User'} size="lg" presence="online" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">Welcome, {user?.name}!</h1>
                <Badge variant="success" size="sm" dot>Authenticated</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Email: {user?.email} &bull; Role: {user?.role || 'Member'}
              </p>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={logout} leftIcon={LogOut}>
            Sign Out
          </Button>
        </div>

        <Card className="p-8 border-brand-200/80 dark:border-brand-800/80 bg-white dark:bg-slate-900 shadow-soft-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Phase 2 Verification Complete!</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authentication, session persistence, guards, and onboarding are working flawlessly.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>JWT authentication simulation with localStorage</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Protected and Public route guards</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>React Hook Form + Zod input validation</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Interactive 3-step onboarding wizard</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
