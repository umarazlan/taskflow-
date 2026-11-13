import React from 'react';
import { cn } from '../../utils/cn';
import { Avatar } from './Avatar';

export function AvatarGroup({
  users = [],
  max = 4,
  size = 'sm',
  className,
  onMoreClick,
}) {
  const visibleUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  return (
    <div className={cn('flex items-center -space-x-2', className)}>
      {visibleUsers.map((user, idx) => (
        <div
          key={user.id || user.email || idx}
          className="relative transition-transform hover:z-10 hover:scale-105 ring-2 ring-white dark:ring-slate-900 rounded-full"
        >
          <Avatar
            src={user.avatar}
            name={user.name}
            alt={user.name}
            size={size}
          />
        </div>
      ))}

      {remainingCount > 0 && (
        <div
          onClick={onMoreClick}
          className={cn(
            'relative z-0 flex items-center justify-center rounded-full bg-slate-200 text-slate-700 font-semibold',
            'ring-2 ring-white dark:ring-slate-900 dark:bg-slate-800 dark:text-slate-300',
            size === 'xs' && 'h-6 w-6 text-[10px]',
            size === 'sm' && 'h-7 w-7 text-xs',
            size === 'md' && 'h-9 w-9 text-xs',
            size === 'lg' && 'h-11 w-11 text-sm',
            onMoreClick && 'cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700'
          )}
          title={`${remainingCount} more members`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
