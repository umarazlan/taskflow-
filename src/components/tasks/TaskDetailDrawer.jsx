import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Tag,
  CheckSquare,
  MessageSquare,
  Paperclip,
  Play,
  Pause,
  Copy,
  Trash2,
  FolderKanban,
  Send,
  Bold,
  Italic,
  List,
  Code,
  Share2,
} from 'lucide-react';
import {
  Drawer,
  Badge,
  Button,
  Input,
  Select,
  Avatar,
  ProgressBar,
  notify,
} from '../ui';
import { INITIAL_USERS } from '../../data/seedData';
import { INITIAL_PROJECTS } from '../../data/mockData';

export function TaskDetailDrawer({
  isOpen,
  onClose,
  task,
  onUpdateTask,
  onDeleteTask,
}) {
  if (!task) return null;

  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status || 'todo');
  const [priority, setPriority] = useState(task.priority || 'medium');
  const [assigneeId, setAssigneeId] = useState(task.assigneeId || 'user-demo');
  const [projectId, setProjectId] = useState(task.projectId || 'proj-1');
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [estimateHours, setEstimateHours] = useState(task.estimateHours || 8);
  const [labels, setLabels] = useState(task.labels || ['Frontend']);
  const [newLabelInput, setNewLabelInput] = useState('');

  // Subtasks checklist state
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Time tracker state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [loggedHours, setLoggedHours] = useState(task.loggedHours || 0);

  // Comments state
  const [comments, setComments] = useState([
    {
      id: 'c-1',
      user: INITIAL_USERS[1],
      text: 'Verified the Figma design tokens match our CSS variables specification.',
      time: '2 hours ago',
    },
    {
      id: 'c-2',
      user: INITIAL_USERS[0],
      text: 'Thanks @Sarah, rolling this into the current sprint build now.',
      time: '45 mins ago',
    },
  ]);
  const [newComment, setNewComment] = useState('');

  // Sync internal state when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'todo');
      setPriority(task.priority || 'medium');
      setAssigneeId(task.assigneeId || 'user-demo');
      setProjectId(task.projectId || 'proj-1');
      setDueDate(task.dueDate || '');
      setEstimateHours(task.estimateHours || 8);
      setLabels(task.labels || ['Frontend']);
      setSubtasks(task.subtasks || []);
      setLoggedHours(task.loggedHours || 0);
    }
  }, [task]);

  // Live timer interval
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleToggleTimer = () => {
    if (isTimerRunning) {
      // Stopped: add to logged hours
      const additionalHours = Math.round((timerSeconds / 3600) * 10) / 10 || 0.1;
      const updatedTotal = Math.round((loggedHours + additionalHours) * 10) / 10;
      setLoggedHours(updatedTotal);
      onUpdateTask(task.id, { loggedHours: updatedTotal });
      setTimerSeconds(0);
      setIsTimerRunning(false);
      notify.success(`Logged ${additionalHours}h to task!`);
    } else {
      setIsTimerRunning(true);
      notify.info('Task timer started');
    }
  };

  const handleSaveField = (field, value) => {
    onUpdateTask(task.id, { [field]: value });
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const updated = [
      ...subtasks,
      { id: `sub-${Date.now()}`, title: newSubtaskTitle.trim(), completed: false },
    ];
    setSubtasks(updated);
    handleSaveField('subtasks', updated);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (index) => {
    const updated = [...subtasks];
    updated[index].completed = !updated[index].completed;
    setSubtasks(updated);
    handleSaveField('subtasks', updated);
  };

  const handleAddLabel = (e) => {
    e.preventDefault();
    if (!newLabelInput.trim() || labels.includes(newLabelInput.trim())) return;
    const updated = [...labels, newLabelInput.trim()];
    setLabels(updated);
    handleSaveField('labels', updated);
    setNewLabelInput('');
  };

  const handleRemoveLabel = (tag) => {
    const updated = labels.filter((l) => l !== tag);
    setLabels(updated);
    handleSaveField('labels', updated);
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const newEntry = {
      id: `c-${Date.now()}`,
      user: INITIAL_USERS[0],
      text: newComment.trim(),
      time: 'Just now',
    };
    setComments([...comments, newEntry]);
    setNewComment('');
    notify.success('Comment posted');
  };

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completedSubtasks = subtasks.filter((s) => s.completed).length;
  const projectObj = INITIAL_PROJECTS.find((p) => p.id === projectId) || INITIAL_PROJECTS[0];
  const assignee = INITIAL_USERS.find((u) => u.id === assigneeId) || INITIAL_USERS[0];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      width="lg"
      title={
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="sm">{projectObj.name}</Badge>
          <span className="text-slate-400">&bull;</span>
          <span className="text-xs text-slate-500 font-mono">{task.id}</span>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              notify.success('Task link copied to clipboard!');
            }}
            leftIcon={Share2}
          >
            Copy link
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDeleteTask(task.id)}
              leftIcon={Trash2}
            >
              Delete
            </Button>
            <Button variant="primary" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Editable Title */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => handleSaveField('title', title)}
            className="w-full text-lg sm:text-xl font-bold text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-brand-500 focus:outline-none transition-colors py-1"
            placeholder="Task Title..."
          />
        </div>

        {/* 2-Column Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                const colMap = {
                  backlog: 'col-backlog',
                  todo: 'col-todo',
                  'in-progress': 'col-inprogress',
                  'in-review': 'col-inreview',
                  done: 'col-done',
                };
                handleSaveField('status', e.target.value);
                handleSaveField('columnId', colMap[e.target.value] || 'col-todo');
              }}
              className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="backlog">Backlog</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="in-review">In Review</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value);
                handleSaveField('priority', e.target.value);
              }}
              className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Assignee
            </label>
            <select
              value={assigneeId}
              onChange={(e) => {
                setAssigneeId(e.target.value);
                handleSaveField('assigneeId', e.target.value);
              }}
              className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {INITIAL_USERS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                handleSaveField('dueDate', e.target.value);
              }}
              className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Labels / Tags */}
        <div>
          <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
            Labels & Tags
          </label>
          <div className="flex flex-wrap items-center gap-1.5">
            {labels.map((tag) => (
              <Badge
                key={tag}
                variant="primary"
                size="sm"
                onRemove={() => handleRemoveLabel(tag)}
              >
                {tag}
              </Badge>
            ))}
            <form onSubmit={handleAddLabel} className="inline-flex">
              <input
                type="text"
                placeholder="+ Add tag"
                value={newLabelInput}
                onChange={(e) => setNewLabelInput(e.target.value)}
                className="rounded-md border border-dashed border-slate-300 dark:border-slate-700 px-2 py-0.5 text-xs bg-transparent focus:border-brand-500 focus:outline-none w-20"
              />
            </form>
          </div>
        </div>

        {/* Rich Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Description
            </label>
            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                onClick={() => setDescription(description + ' **bold** ')}
                className="p-1 hover:text-slate-700 dark:hover:text-white rounded"
                title="Bold"
              >
                <Bold className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => setDescription(description + ' *italic* ')}
                className="p-1 hover:text-slate-700 dark:hover:text-white rounded"
                title="Italic"
              >
                <Italic className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => setDescription(description + '\n- Bullet point')}
                className="p-1 hover:text-slate-700 dark:hover:text-white rounded"
                title="Bullet list"
              >
                <List className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => setDescription(description + ' `code` ')}
                className="p-1 hover:text-slate-700 dark:hover:text-white rounded"
                title="Code block"
              >
                <Code className="h-3 w-3" />
              </button>
            </div>
          </div>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => handleSaveField('description', description)}
            placeholder="Add detailed markdown acceptance criteria..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-xs text-slate-800 dark:text-slate-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* Subtasks Checklist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Subtasks Checklist ({completedSubtasks}/{subtasks.length})
            </h4>
            <span className="text-[11px] text-slate-400 font-semibold">
              {subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0}%
            </span>
          </div>

          {subtasks.length > 0 && (
            <ProgressBar
              value={subtasks.length > 0 ? (completedSubtasks / subtasks.length) * 100 : 0}
              size="xs"
            />
          )}

          <div className="space-y-2">
            {subtasks.map((sub, index) => (
              <div
                key={sub.id || index}
                className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-xs"
              >
                <input
                  type="checkbox"
                  checked={sub.completed}
                  onChange={() => handleToggleSubtask(index)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span className={sub.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}>
                  {sub.title}
                </span>
              </div>
            ))}

            <form onSubmit={handleAddSubtask} className="flex gap-2">
              <input
                type="text"
                placeholder="+ Add a subtask checklist item..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                className="flex-1 rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 focus:border-brand-500 focus:outline-none"
              />
              <Button type="submit" variant="secondary" size="xs">
                Add
              </Button>
            </form>
          </div>
        </div>

        {/* Time Tracker Widget */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 flex items-center justify-center font-bold">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Time Logged: {loggedHours} hrs
              </p>
              <p className="text-[11px] text-slate-400">
                Estimate: {estimateHours} hrs &bull; Timer: {formatTimer(timerSeconds)}
              </p>
            </div>
          </div>

          <Button
            variant={isTimerRunning ? 'danger' : 'primary'}
            size="sm"
            onClick={handleToggleTimer}
            leftIcon={isTimerRunning ? Pause : Play}
          >
            {isTimerRunning ? 'Stop Timer' : 'Start Timer'}
          </Button>
        </div>

        {/* Comments Section */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Discussion & Mentions ({comments.length})
          </h4>

          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="flex items-start gap-2.5 text-xs">
                <Avatar name={c.user.name} src={c.user.avatar} size="xs" />
                <div className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900 dark:text-white">{c.user.name}</span>
                    <span className="text-[10px] text-slate-400">{c.time}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{c.text}</p>
                </div>
              </div>
            ))}

            <form onSubmit={handlePostComment} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Write a comment... (use @name to mention)"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 px-3.5 py-2 text-xs bg-white dark:bg-slate-900 focus:border-brand-500 focus:outline-none"
              />
              <Button type="submit" variant="primary" size="md" rightIcon={Send}>
                Post
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
