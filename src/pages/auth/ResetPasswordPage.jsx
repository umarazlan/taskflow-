import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Kanban, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
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

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const passwordValue = watch('password');
  const strength = useMemo(() => calculatePasswordStrength(passwordValue), [passwordValue]);

  const onSubmit = async (data) => {
    try {
      await resetPassword(data.password);
      setIsSuccess(true);
    } catch {
      // Handled in context
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
          Set new password
        </h2>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          Your new password must be different from previous passwords.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="p-7 shadow-soft-lg border-slate-200/90 dark:border-slate-800">
          {isSuccess ? (
            <div className="text-center py-4 space-y-4 animate-scaleIn">
              <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-subtle ring-8 ring-emerald-50/50">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Password reset complete!
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                  You can now log in with your updated credentials.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  rightIcon={ArrowRight}
                  onClick={() => navigate('/login')}
                >
                  Back to Login
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  label="New Password"
                  type="password"
                  placeholder="At least 8 characters"
                  leftIcon={Lock}
                  error={errors.password?.message}
                  {...register('password')}
                />

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
                label="Confirm New Password"
                type="password"
                placeholder="Re-enter new password"
                leftIcon={Lock}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                rightIcon={ArrowRight}
                className="mt-2"
              >
                Reset Password
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
