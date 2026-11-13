import React from 'react';
import { cn } from '../../utils/cn';

const sizes = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

const variants = {
  brand: 'bg-brand-600 dark:bg-brand-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  sky: 'bg-sky-500',
};

export function ProgressBar({
  value = 0,
  max = 100,
  size = 'md',
  variant,
  showLabel = false,
  className,
}) {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  // Auto pick color based on percentage if no variant specified
  const autoVariant =
    variant ||
    (percentage === 100
      ? 'success'
      : percentage > 50
      ? 'brand'
      : percentage > 25
      ? 'warning'
      : 'danger');

  return (
    <div className={cn('w-full flex flex-col gap-1', className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
          <span>Progress</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">{percentage}%</span>
        </div>
      )}
      <div
        className={cn(
          'w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden',
          sizes[size]
        )}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-out',
            variants[autoVariant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
