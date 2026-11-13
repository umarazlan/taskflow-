import React, { useState } from 'react';
import { Modal, Input, Textarea, Select, Button, notify } from '../ui';
import { FolderKanban, CheckSquare } from 'lucide-react';

export function CreateModal({ isOpen, onClose, initialType = 'task' }) {
  const [type, setType] = useState(initialType);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [project, setProject] = useState('proj-1');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      notify.error('Title is required');
      return;
    }

    if (type === 'task') {
      notify.success(`Task "${title}" created successfully!`);
    } else {
      notify.success(`Project "${title}" created successfully!`);
    }

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type === 'task' ? 'Create New Task' : 'Create New Project'}
      description={
        type === 'task'
          ? 'Add a deliverable to your project board with priority and assignees.'
          : 'Organize related tasks and milestones under a new initiative.'
      }
      footer={
        <>
          <Button variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleCreate}>
            {type === 'task' ? 'Create Task' : 'Create Project'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleCreate} className="space-y-4">
        {/* Type toggle */}
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setType('task')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              type === 'task'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-subtle'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="h-3.5 w-3.5" /> Task
          </button>
          <button
            type="button"
            onClick={() => setType('project')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              type === 'project'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-subtle'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FolderKanban className="h-3.5 w-3.5" /> Project
          </button>
        </div>

        <Input
          label={type === 'task' ? 'Task Title' : 'Project Name'}
          placeholder={type === 'task' ? 'e.g. Implement OAuth login provider' : 'e.g. Mobile App v2'}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {type === 'task' && (
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Project"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              options={[
                { label: 'Core Mobile App', value: 'proj-1' },
                { label: 'Website Redesign', value: 'proj-2' },
                { label: 'API Infrastructure', value: 'proj-3' },
              ]}
            />
            <Select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              options={[
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' },
                { label: 'Urgent', value: 'urgent' },
              ]}
            />
          </div>
        )}

        <Textarea
          label="Description / Acceptance Criteria"
          placeholder="Add details, links, or requirements..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </form>
    </Modal>
  );
}
