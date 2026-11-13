import React, { useState } from 'react';
import { cn } from '../../utils/cn';

const sizeMap = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-xs',
  lg: 'h-11 w-11 text-sm font-semibold',
  xl: 'h-14 w-14 text-base font-semibold',
};

const presenceSizes = {
  xs: 'h-1.5 w-1.5 bottom-0 right-0',
  sm: 'h-2 w-2 bottom-0 right-0 ring-1',
  md: 'h-2.5 w-2.5 bottom-0 right-0 ring-2',
  lg: 'h-3 w-3 bottom-0.5 right-0.5 ring-2',
  xl: 'h-3.5 w-3.5 bottom-0.5 right-0.5 ring-2',
};

const presenceColors = {
  online: 'bg-emerald-500',
  busy: 'bg-rose-500',
  away: 'bg-amber-500',
  offline: 'bg-slate-400',
};

// Deterministic pastel colors based on name
const bgColors = [
  'bg-indigo-500 text-white',
  'bg-emerald-500 text-white',
  'bg-violet-500 text-white',
  'bg-sky-500 text-white',
  'bg-amber-500 text-white',
  'bg-rose-500 text-white',
  'bg-teal-500 text-white',
  'bg-pink-500 text-white',
];

function getInitials(name = '') {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getColorIndex(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % bgColors.length;
}

export function Avatar({
  src,
  alt = '',
  name = '',
  size = 'md',
  presence,
  className,
  ...props
}) {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name || alt);
  const colorClass = bgColors[getColorIndex(name || alt || 'user')];

  const showImage = src && !imageError;

  return (
    <div className={cn('relative inline-block select-none shrink-0', className)} {...props}>
      <div
        className={cn(
          'flex items-center justify-center rounded-full font-medium overflow-hidden shadow-subtle',
          sizeMap[size],
          !showImage && colorClass
        )}
        title={name || alt}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || name}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {presence && (
        <span
          className={cn(
            'absolute rounded-full ring-white dark:ring-slate-900',
            presenceSizes[size],
            presenceColors[presence]
          )}
          title={`Status: ${presence}`}
        />
      )}
    </div>
  );
}
