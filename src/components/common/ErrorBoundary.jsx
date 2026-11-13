import React from 'react';
import { AlertTriangle, RotateCcw, Home, Kanban } from 'lucide-react';
import { Button } from '../ui';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught an error]:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/app/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
          <div className="h-14 w-14 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/70 dark:text-rose-400 flex items-center justify-center shadow-soft mb-6 ring-8 ring-rose-50/50">
            <AlertTriangle className="h-7 w-7" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Something went unexpected
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
            TaskFlow encountered a problem while rendering this view. Your saved data remains safe in local storage.
          </p>

          {this.state.error && (
            <div className="mt-4 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left max-w-lg w-full overflow-x-auto text-[11px] font-mono text-rose-600 dark:text-rose-400">
              {this.state.error.toString()}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={this.handleReload}
              leftIcon={RotateCcw}
            >
              Reload Page
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={this.handleGoHome}
              leftIcon={Home}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
