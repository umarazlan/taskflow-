import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export function PublicRoute() {
  const { isAuthenticated, isOnboarded, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600 dark:text-brand-400" />
      </div>
    );
  }

  if (isAuthenticated) {
    if (!isOnboarded) {
      return <Navigate to="/onboarding" replace />;
    }
    const origin = location.state?.from?.pathname || '/app/dashboard';
    return <Navigate to={origin} replace />;
  }

  return <Outlet />;
}
