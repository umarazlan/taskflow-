import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

export function Dropdown({
  trigger,
  children,
  align = 'left', // 'left' | 'right'
  className,
  menuClassName,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn('relative inline-block text-left', className)}>
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-1.5 w-56 rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-soft-lg',
            'dark:border-slate-800 dark:bg-slate-900 animate-scaleIn origin-top',
            align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left',
            menuClassName
          )}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({
  children,
  icon: Icon,
  onClick,
  danger = false,
  disabled = false,
  className,
  ...props
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        'group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 transition-colors',
        'hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/80 cursor-pointer',
        'focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-800',
        danger && 'text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/40',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      {...props}
    >
      {Icon && (
        <Icon
          className={cn(
            'h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300',
            danger && 'text-rose-500 group-hover:text-rose-600 dark:text-rose-400'
          )}
        />
      )}
      <span className="flex-1 text-left truncate">{children}</span>
    </button>
  );
}

export function DropdownDivider({ className }) {
  return (
    <div
      className={cn('my-1 h-px bg-slate-100 dark:bg-slate-800 -mx-1.5', className)}
    />
  );
}

export function DropdownLabel({ children, className }) {
  return (
    <div
      className={cn(
        'px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500',
        className
      )}
    >
      {children}
    </div>
  );
}
