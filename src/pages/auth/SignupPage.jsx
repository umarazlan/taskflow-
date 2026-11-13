import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Kanban,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Check,
} from 'lucide-react';
import { Button, Input, Checkbox, Card, ProgressBar } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the Terms of Service' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

function calculatePasswordStrength(pass = '') {
  let score = 0;
  if (!pass) return { score: 0, label: 'Empty', color: 'bg-slate-200' };
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;

  if (score === 1) return { score: 25, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-500' };
  if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-500' };
  if (score === 3) return { score: 75, label: 'Good', color: 'bg-brand-500', text: 'text-brand-500' };
  return { score: 100, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500' };
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
  });

  const passwordValue = watch('password');
  const strength = useMemo(() => calculatePasswordStrength(passwordValue), [passwordValue]);

  const onSubmit = async (data) => {
    setErrorMessage('');
    try {
      await signup({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      navigate('/onboarding');
    } catch (err) {
      setErrorMessage(err.message || 'Signup failed. Please try again.');
    }
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
          Create your workspace
        </h2>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          Get started with your free 14-day team trial. No card required.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="p-7 shadow-soft-lg border-slate-200/90 dark:border-slate-800">
          {errorMessage && (
            <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Alex Morgan"
              leftIcon={User}
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Work Email"
              type="email"
              placeholder="alex@company.com"
              leftIcon={Mail}
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="At least 8 characters"
                leftIcon={Lock}
                error={errors.password?.message}
                {...register('password')}
              />

              {/* Password strength meter */}
              {passwordValue && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Password strength</span>
                    <span className={`font-semibold ${strength.text}`}>{strength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              leftIcon={Lock}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <div className="pt-1">
              <Checkbox
                label="I agree to the Terms of Service and Privacy Policy"
                {...register('agreeTerms')}
              />
              {errors.agreeTerms && (
                <p className="mt-1 text-xs font-medium text-rose-500">
                  {errors.agreeTerms.message}
                </p>
              )}
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
              Create Account
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
}
