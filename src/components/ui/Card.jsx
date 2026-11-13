import React from 'react';
import { cn } from '../../utils/cn';

export function Card({ children, className, hover = false, onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border border-slate-200/80 bg-white text-slate-900 shadow-soft',
        'dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100',
        hover &&
          'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft-md hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-5 pb-3', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className, as: Component = 'h3', ...props }) {
  return (
    <Component
      className={cn('text-base font-semibold leading-tight tracking-tight text-slate-900 dark:text-white', className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p
      className={cn('text-xs text-slate-500 dark:text-slate-400', className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn('p-5 pt-0', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div
      className={cn('flex items-center p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}
