import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

const variants = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  primary: 'bg-brand-50 text-brand-700 dark:bg-brand-950/70 dark:text-brand-300 border-brand-200 dark:border-brand-800/60',
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
  warning: 'bg-amber-50 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
  danger: 'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
  info: 'bg-sky-50 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300 border-sky-200 dark:border-sky-800/60',
  purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
  neutral: 'bg-slate-200/70 text-slate-800 dark:bg-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600',
};

const dotColors = {
  default: 'bg-slate-400',
  primary: 'bg-brand-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  info: 'bg-sky-500',
  purple: 'bg-purple-500',
  neutral: 'bg-slate-500',
};

const sizes = {
  sm: 'text-[11px] px-1.5 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-0.5 gap-1.5 font-medium',
  lg: 'text-xs px-3 py-1 gap-1.5 font-semibold',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  dotColor,
  onRemove,
  className,
  ...props
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border tracking-tight font-medium select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full shrink-0',
            dotColor || dotColors[variant]
          )}
        />
      )}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 -mr-1 rounded p-0.5 hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none"
          aria-label="Remove badge"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
