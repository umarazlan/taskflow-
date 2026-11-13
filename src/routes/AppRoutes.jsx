import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { AppLayout } from '../components/layout/AppLayout';
import { Loader2 } from 'lucide-react';

// Lazy loaded pages
const LandingPage = lazy(() => import('../pages/auth/LandingPage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const SignupPage = lazy(() => import('../pages/auth/SignupPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));
const OnboardingPage = lazy(() => import('../pages/auth/OnboardingPage'));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const ProjectsPage = lazy(() => import('../pages/projects/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('../pages/projects/ProjectDetailPage'));
const MyTasksPage = lazy(() => import('../pages/tasks/MyTasksPage'));
const CalendarPage = lazy(() => import('../pages/calendar/CalendarPage'));
const TeamPage = lazy(() => import('../pages/team/TeamPage'));
const ReportsPage = lazy(() => import('../pages/reports/ReportsPage'));
const NotificationsPage = lazy(() => import('../pages/notifications/NotificationsPage'));
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Loader2 className="h-8 w-8 animate-spin text-brand-600 dark:text-brand-400" />
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Landing Page (Always accessible to all users) */}
        <Route path="/" element={<LandingPage />} />

        {/* Guest Only Auth Routes (redirects logged-in users to /app/dashboard) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Onboarding Wizard Route */}
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Protected App Routes with AppLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/app/dashboard" element={<DashboardPage />} />
            <Route path="/app/projects" element={<ProjectsPage />} />
            <Route path="/app/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/app/my-tasks" element={<MyTasksPage />} />
            <Route path="/app/calendar" element={<CalendarPage />} />
            <Route path="/app/team" element={<TeamPage />} />
            <Route path="/app/reports" element={<ReportsPage />} />
            <Route path="/app/notifications" element={<NotificationsPage />} />
            <Route path="/app/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
