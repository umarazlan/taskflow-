import React, { forwardRef } from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Checkbox = forwardRef(
  (
    {
      label,
      description,
      checked,
      indeterminate = false,
      onChange,
      disabled = false,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <label
        htmlFor={inputId}
        className={cn(
          'inline-flex items-start gap-2.5 cursor-pointer select-none text-sm group',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'h-4.5 w-4.5 rounded border transition-all duration-150 flex items-center justify-center',
              'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900',
              'group-hover:border-brand-500 group-hover:dark:border-brand-400',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/20 peer-focus-visible:border-brand-500',
              (checked || indeterminate) &&
                'bg-brand-600 border-brand-600 dark:bg-brand-500 dark:border-brand-500 text-white'
            )}
          >
            {indeterminate ? (
              <Minus className="h-3 w-3 stroke-[3] text-white" />
            ) : checked ? (
              <Check className="h-3 w-3 stroke-[3] text-white" />
            ) : null}
          </div>
        </div>

        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span className="font-medium text-slate-800 dark:text-slate-200 leading-tight">
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
