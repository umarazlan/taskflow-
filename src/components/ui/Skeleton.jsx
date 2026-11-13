import React from 'react';
import { cn } from '../../utils/cn';

export function Skeleton({ className, variant = 'rect', ...props }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-slate-200/80 dark:bg-slate-800/90',
        'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/30 dark:before:via-white/5 before:to-transparent',
        variant === 'circle' && 'rounded-full',
        variant === 'rect' && 'rounded-lg',
        variant === 'text' && 'h-3.5 w-full rounded-md',
        className
      )}
      {...props}
    />
  );
}

export function SkeletonCard({ className }) {
  return (
    <div className={cn('rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 bg-white dark:bg-slate-900', className)}>
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" className="h-9 w-9" />
        <div className="space-y-1.5 flex-1">
          <Skeleton variant="text" className="w-1/2" />
          <Skeleton variant="text" className="w-1/3 h-2.5" />
        </div>
      </div>
      <Skeleton variant="rect" className="h-20 w-full" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton variant="text" className="w-20 h-4" />
        <Skeleton variant="circle" className="h-6 w-6" />
      </div>
    </div>
  );
}
