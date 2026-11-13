import React, { forwardRef } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Select = forwardRef(
  (
    {
      label,
      error,
      helperText,
      options = [],
      placeholder = 'Select an option',
      className,
      selectClassName,
      id,
      disabled,
      required,
      children,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={cn('w-full flex flex-col gap-1.5', className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300"
          >
            {label}
            {required && <span className="ml-1 text-rose-500">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              'w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-9 text-sm text-slate-900 transition-colors',
              'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
              'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 dark:disabled:bg-slate-900 dark:disabled:text-slate-600',
              'dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:focus:border-brand-400',
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-500/80'
                : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600',
              selectClassName
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-slate-400">
                {placeholder}
              </option>
            )}
            {children
              ? children
              : options.map((opt) => (
                  <option
                    key={typeof opt === 'object' ? opt.value : opt}
                    value={typeof opt === 'object' ? opt.value : opt}
                    disabled={typeof opt === 'object' ? opt.disabled : false}
                  >
                    {typeof opt === 'object' ? opt.label : opt}
                  </option>
                ))}
          </select>

          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>

        {error ? (
          <p className="text-xs font-medium text-rose-500 dark:text-rose-400 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
