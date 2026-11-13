import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      type = 'text',
      className,
      inputClassName,
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const isPassword = type === 'password';
    const computedType = isPassword ? (showPassword ? 'text' : 'password') : type;

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

        <div className="relative flex items-center">
          {LeftIcon && (
            <div className="pointer-events-none absolute left-3 flex items-center text-slate-400 dark:text-slate-500">
              <LeftIcon className="h-4 w-4" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={computedType}
            disabled={disabled}
            className={cn(
              'w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 transition-colors placeholder:text-slate-400',
              'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
              'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 dark:disabled:bg-slate-900 dark:disabled:text-slate-600',
              'dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:placeholder:text-slate-500 dark:focus:border-brand-400',
              LeftIcon && 'pl-9',
              (RightIcon || isPassword || error) && 'pr-9',
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-500/80'
                : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600',
              inputClassName
            )}
            {...props}
          />

          {isPassword && !error && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              className="absolute right-3 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}

          {error && (
            <div className="pointer-events-none absolute right-3 flex items-center text-rose-500">
              <AlertCircle className="h-4 w-4" />
            </div>
          )}

          {!isPassword && !error && RightIcon && (
            <div className="pointer-events-none absolute right-3 flex items-center text-slate-400 dark:text-slate-500">
              <RightIcon className="h-4 w-4" />
            </div>
          )}
        </div>

        {error ? (
          <p className="text-xs font-medium text-rose-500 dark:text-rose-400 flex items-center gap-1">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
