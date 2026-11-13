import React from 'react';
import { Modal } from '../ui';
import { Command, Keyboard } from 'lucide-react';

const SHORTCUT_GROUPS = [
  {
    category: 'Global & Navigation',
    shortcuts: [
      { key: '⌘ + K', desc: 'Open Command Palette' },
      { key: '?', desc: 'Toggle keyboard shortcuts dialog' },
      { key: 'ESC', desc: 'Close dialog, drawer, or dropdown' },
      { key: '/', desc: 'Quick search workspace' },
    ],
  },
  {
    category: 'Quick Actions',
    shortcuts: [
      { key: 'C', desc: 'Create new task' },
      { key: 'P', desc: 'Create new project' },
      { key: 'D', desc: 'Toggle dark / light theme' },
    ],
  },
  {
    category: 'Kanban & Tasks',
    shortcuts: [
      { key: 'Space', desc: 'Open selected task detail drawer' },
      { key: 'E', desc: 'Edit task title' },
      { key: 'Del / Backspace', desc: 'Delete selected task (with confirm)' },
    ],
  },
];

export function ShortcutsModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Keyboard Shortcuts"
      description="Navigate TaskFlow at the speed of thought."
      size="md"
    >
      <div className="space-y-6 py-2">
        {SHORTCUT_GROUPS.map((group) => (
          <div key={group.category} className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {group.category}
            </h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
              {group.shortcuts.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between px-3.5 py-2 text-xs"
                >
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {item.desc}
                  </span>
                  <kbd className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-mono font-semibold text-slate-700 shadow-subtle dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {item.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
