import React from 'react';
import { cn } from '../../utils/cn';

export function Tabs({
  tabs = [],
  activeTab,
  onChange,
  variant = 'underline', // 'underline' | 'pills' | 'segmented'
  className,
}) {
  return (
    <div
      className={cn(
        'flex items-center',
        variant === 'underline' && 'border-b border-slate-200 dark:border-slate-800 gap-6',
        variant === 'pills' && 'gap-1.5 p-1 bg-slate-100/70 dark:bg-slate-800/60 rounded-xl',
        variant === 'segmented' && 'gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'inline-flex items-center gap-2 text-xs font-medium transition-all select-none cursor-pointer',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-md',
              variant === 'underline' && [
                'py-3 border-b-2 -mb-px px-0.5',
                isActive
                  ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-700',
              ],
              variant === 'pills' && [
                'px-3 py-1.5 rounded-lg',
                isActive
                  ? 'bg-white text-slate-900 shadow-subtle dark:bg-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
              ],
              variant === 'segmented' && [
                'px-3 py-1.5 rounded-md flex-1 justify-center',
                isActive
                  ? 'bg-brand-600 text-white shadow-subtle dark:bg-brand-500 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200',
              ]
            )}
          >
            {Icon && <Icon className="h-4 w-4 shrink-0" />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.2 text-[10px] font-semibold',
                  isActive
                    ? 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                    : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
