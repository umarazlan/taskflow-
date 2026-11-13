import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Kanban, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data.email);
      setSubmittedEmail(data.email);
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
          Reset your password
        </h2>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          Enter your registered email and we'll send you recovery instructions.
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
                  Check your inbox
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  We've sent a password reset link to{' '}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{submittedEmail}</span>.
                </p>
              </div>

              <div className="pt-2 space-y-2.5">
                <Link to="/reset-password">
                  <Button variant="primary" size="md" fullWidth rightIcon={ArrowRight}>
                    Proceed to Reset Password
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  onClick={() => setIsSuccess(false)}
                >
                  Didn't receive email? Try again
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@company.com"
                leftIcon={Mail}
                error={errors.email?.message}
                {...register('email')}
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
                Send Reset Link
              </Button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
