import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Textarea = forwardRef(
  (
    {
      label,
      error,
      helperText,
      maxLength,
      value,
      className,
      textareaClassName,
      id,
      disabled,
      required,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const charCount = typeof value === 'string' ? value.length : undefined;

    return (
      <div className={cn('w-full flex flex-col gap-1.5', className)}>
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={inputId}
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300"
            >
              {label}
              {required && <span className="ml-1 text-rose-500">*</span>}
            </label>
          )}

          {maxLength && (
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              {charCount !== undefined ? `${charCount}/${maxLength}` : `Max ${maxLength}`}
            </span>
          )}
        </div>

        <div className="relative">
          <textarea
            ref={ref}
            id={inputId}
            value={value}
            maxLength={maxLength}
            rows={rows}
            disabled={disabled}
            className={cn(
              'w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 transition-colors placeholder:text-slate-400',
              'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
              'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 dark:disabled:bg-slate-900 dark:disabled:text-slate-600',
              'dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:placeholder:text-slate-500 dark:focus:border-brand-400',
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-500/80'
                : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600',
              textareaClassName
            )}
            {...props}
          />
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

Textarea.displayName = 'Textarea';
