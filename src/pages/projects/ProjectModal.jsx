import React, { useState, useEffect } from 'react';
import { Modal, Input, Textarea, Select, Button, notify } from '../../components/ui';

const COLOR_PRESETS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];
const ICON_PRESETS = ['📱', '🎨', '⚡', '🚀', '🛠️', '💡', '📊', '🛡️'];

export function ProjectModal({ isOpen, onClose, onSave, project = null }) {
  const isEditing = !!project;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [icon, setIcon] = useState('📱');
  const [status, setStatus] = useState('in-progress');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (project) {
      setName(project.name || '');
      setDescription(project.description || '');
      setColor(project.color || '#6366f1');
      setIcon(project.icon || '📱');
      setStatus(project.status || 'in-progress');
      setDueDate(project.dueDate || '');
    } else {
      setName('');
      setDescription('');
      setColor('#6366f1');
      setIcon('📱');
      setStatus('in-progress');
      setDueDate('');
    }
  }, [project, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      notify.error('Project name is required');
      return;
    }

    onSave({
      name,
      description,
      color,
      icon,
      status,
      dueDate,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Project' : 'Create New Project'}
      description={
        isEditing
          ? 'Update project deliverables, timeline, or branding.'
          : 'Set up a new initiative for your workspace team.'
      }
      footer={
        <>
          <Button variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Create Project'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Project Name"
          placeholder="e.g. Core Mobile App v2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Icon
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ICON_PRESETS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`h-8 w-8 text-base rounded-lg border flex items-center justify-center transition-all ${
                    icon === ic
                      ? 'border-brand-600 bg-brand-50 dark:bg-brand-950 scale-105'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Color Theme
            </label>
            <div className="flex items-center gap-2 pt-1">
              {COLOR_PRESETS.map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setColor(col)}
                  className={`h-6 w-6 rounded-full transition-transform ${
                    color === col ? 'scale-125 ring-2 ring-offset-2 ring-brand-500' : ''
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { label: 'In Progress', value: 'in-progress' },
              { label: 'Active', value: 'active' },
              { label: 'Completed', value: 'completed' },
              { label: 'Archived', value: 'archived' },
            ]}
          />

          <Input
            label="Target Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <Textarea
          label="Description / Goals"
          placeholder="Brief summary of project objectives..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </form>
    </Modal>
  );
}
