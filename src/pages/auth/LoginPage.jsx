import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Kanban,
  Mail,
  Lock,
  ArrowRight,
  Zap,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Button, Input, Checkbox, Card, Badge } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

// Zod schema for login
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const onSubmit = async (data) => {
    setErrorMessage('');
    try {
      const user = await login(data.email, data.password);
      const destination = location.state?.from?.pathname || (user.onboarded ? '/app/dashboard' : '/onboarding');
      navigate(destination, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const fillDemoAccount = () => {
    setValue('email', 'demo@taskflow.com');
    setValue('password', 'Demo@1234');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group mb-4">
          <div className="h-10 w-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-soft transition-transform group-hover:scale-105">
            <Kanban className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">TaskFlow</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome back
        </h2>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          Enter your credentials to access your workspace.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="p-7 shadow-soft-lg border-slate-200/90 dark:border-slate-800">
          {/* 1-Click Demo Box */}
          <div className="mb-6 rounded-xl border border-brand-200 bg-brand-50/60 p-3.5 dark:border-brand-800/80 dark:bg-brand-950/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                <span className="text-xs font-semibold text-brand-900 dark:text-brand-200">
                  Pre-filled Demo Account
                </span>
              </div>
              <Badge variant="primary" size="sm">Instant</Badge>
            </div>
            <p className="mt-1 text-[11px] text-brand-700/80 dark:text-brand-300/80">
              demo@taskflow.com &bull; Demo@1234
            </p>
            <button
              type="button"
              onClick={fillDemoAccount}
              className="mt-2.5 text-xs font-semibold text-brand-700 dark:text-brand-300 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Click to autofill credentials &rarr;
            </button>
          </div>

          {errorMessage && (
            <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@company.com"
              leftIcon={Mail}
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                leftIcon={Lock}
                error={errors.password?.message}
                {...register('password')}
              />
              <div className="flex items-center justify-between mt-2">
                <Checkbox
                  label="Remember me"
                  {...register('rememberMe')}
                />
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              rightIcon={ArrowRight}
              className="mt-2"
            >
              Sign In
            </Button>
          </form>

          {/* Social Logins (UI Only) */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-white dark:bg-slate-900 px-2 text-slate-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => alert('Social OAuth is simulated. Use standard email or 1-Click Demo!')}
                className="text-xs"
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Google
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={() => alert('Social OAuth is simulated. Use standard email or 1-Click Demo!')}
                className="text-xs"
              >
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                GitHub
              </Button>
            </div>
          </div>
        </Card>

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
