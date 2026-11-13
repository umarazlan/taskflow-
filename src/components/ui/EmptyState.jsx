import React from 'react';
import { FolderKanban } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

export function EmptyState({
  icon: Icon = FolderKanban,
  title = 'No items found',
  description = 'Get started by creating your first item.',
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
  children,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center dark:border-slate-800',
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400 mb-4 shadow-subtle ring-8 ring-brand-50/50 dark:ring-brand-950/30">
        <Icon className="h-7 w-7" />
      </div>

      <h4 className="text-base font-semibold text-slate-900 dark:text-white">
        {title}
      </h4>

      <p className="mt-1.5 max-w-sm text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        {description}
      </p>

      {children && <div className="mt-4">{children}</div>}

      {(actionLabel || secondaryActionLabel) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          {actionLabel && (
            <Button variant="primary" size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && (
            <Button variant="outline" size="sm" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
