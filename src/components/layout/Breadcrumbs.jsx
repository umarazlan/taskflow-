import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNameMap = {
  app: 'TaskFlow',
  dashboard: 'Dashboard',
  projects: 'Projects',
  'my-tasks': 'My Tasks',
  calendar: 'Calendar',
  team: 'Team Directory',
  reports: 'Reports & Velocity',
  notifications: 'Notifications',
  settings: 'Settings',
};

export function Breadcrumbs({ className }) {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Filter out 'app' if desired or keep as root
  const crumbs = pathnames.slice(1); // skip 'app'

  if (crumbs.length === 0) return null;

  return (
    <nav className={`flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 ${className || ''}`} aria-label="Breadcrumb">
      <Link
        to="/app/dashboard"
        className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>

      {crumbs.map((value, index) => {
        const to = `/app/${crumbs.slice(0, index + 1).join('/')}`;
        const isLast = index === crumbs.length - 1;
        const name = routeNameMap[value] || value.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

        return (
          <React.Fragment key={to}>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                {name}
              </span>
            ) : (
              <Link
                to={to}
                className="hover:text-slate-900 dark:hover:text-white transition-colors truncate max-w-[150px]"
              >
                {name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
