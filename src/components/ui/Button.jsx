import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const variants = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm focus-visible:ring-brand-500 dark:bg-brand-500 dark:hover:bg-brand-600',
  secondary:
    'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 focus-visible:ring-slate-400',
  outline:
    'border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 focus-visible:ring-brand-500',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800/80 focus-visible:ring-brand-500',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm focus-visible:ring-rose-500 dark:bg-rose-600 dark:hover:bg-rose-700',
  subtle:
    'bg-brand-50 text-brand-700 hover:bg-brand-100 active:bg-brand-200 dark:bg-brand-950/60 dark:text-brand-300 dark:hover:bg-brand-900/50 focus-visible:ring-brand-500',
};

const sizes = {
  xs: 'h-7 px-2.5 text-xs rounded-md gap-1.5',
  sm: 'h-8 px-3 text-xs font-medium rounded-lg gap-1.5',
  md: 'h-9 px-4 text-sm font-medium rounded-lg gap-2',
  lg: 'h-11 px-5 text-base font-medium rounded-xl gap-2.5',
  icon: 'h-9 w-9 p-0 justify-center rounded-lg',
  'icon-sm': 'h-7 w-7 p-0 justify-center rounded-md',
};

export const Button = forwardRef(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      type = 'button',
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900',
          'disabled:cursor-not-allowed disabled:opacity-50 select-none cursor-pointer',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current" />
        ) : LeftIcon ? (
          <LeftIcon className="h-4 w-4 shrink-0 text-current" />
        ) : null}

        {children && <span>{children}</span>}

        {!isLoading && RightIcon && (
          <RightIcon className="h-4 w-4 shrink-0 text-current" />
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
