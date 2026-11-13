import React from 'react';
import toast, { Toaster as HotToaster } from 'react-hot-toast';

export const notify = {
  success: (message, options) =>
    toast.success(message, {
      duration: 3500,
      ...options,
    }),
  error: (message, options) =>
    toast.error(message, {
      duration: 4000,
      ...options,
    }),
  info: (message, options) =>
    toast(message, {
      icon: 'ℹ️',
      duration: 3500,
      ...options,
    }),
  loading: (message, options) =>
    toast.loading(message, {
      ...options,
    }),
  dismiss: (id) => toast.dismiss(id),
};

export function ToastProvider() {
  return (
    <HotToaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        className:
          '!bg-white !text-slate-900 !border !border-slate-200/90 !shadow-soft-lg !rounded-xl !text-xs !font-medium dark:!bg-slate-900 dark:!text-slate-100 dark:!border-slate-800',
        duration: 3500,
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#f43f5e',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
}
