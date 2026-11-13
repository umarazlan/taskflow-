import React from 'react';
import { AlertTriangle, Trash2, Info } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { cn } from '../../utils/cn';

const typeConfig = {
  danger: {
    icon: Trash2,
    iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 ring-8 ring-rose-50/50 dark:ring-rose-950/20',
    confirmVariant: 'danger',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 ring-8 ring-amber-50/50 dark:ring-amber-950/20',
    confirmVariant: 'primary',
  },
  info: {
    icon: Info,
    iconBg: 'bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 ring-8 ring-sky-50/50 dark:ring-sky-950/20',
    confirmVariant: 'primary',
  },
};

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  type = 'danger',
  isLoading = false,
}) {
  const config = typeConfig[type] || typeConfig.danger;
  const Icon = config.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center pt-2">
        <div className={cn('mb-4 flex h-12 w-12 items-center justify-center rounded-full', config.iconBg)}>
          <Icon className="h-6 w-6" />
        </div>

        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>

        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {message}
        </p>

        <div className="mt-6 flex w-full gap-2.5">
          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>

          <Button
            variant={config.confirmVariant}
            size="md"
            fullWidth
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
