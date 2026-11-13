import React from 'react';
import { Link } from 'react-router-dom';
import { Kanban, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/ui';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="h-14 w-14 rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 flex items-center justify-center shadow-soft mb-6">
        <Kanban className="h-7 w-7" />
      </div>

      <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-2">
        Error 404
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
        Page not found
      </h1>

      <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
        Sorry, we couldn’t find the page you’re looking for. It might have been moved or removed.
      </p>

      <div className="mt-6 flex gap-3">
        <Link to="/">
          <Button variant="outline" size="md" leftIcon={ArrowLeft}>
            Back to Home
          </Button>
        </Link>
        <Link to="/app/dashboard">
          <Button variant="primary" size="md" leftIcon={Home}>
            Go to App
          </Button>
        </Link>
      </div>
    </div>
  );
}
