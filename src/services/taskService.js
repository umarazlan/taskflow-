import { storage } from './storage';
import { INITIAL_TASKS } from '../data/mockData';

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

function getStoredTasks() {
  let list = storage.get('tasks');
  if (!list || !Array.isArray(list) || list.length === 0) {
    list = INITIAL_TASKS;
    storage.set('tasks', list);
  }
  return list;
}

export const taskService = {
  getAllTasks: async () => {
    await delay(150);
    return getStoredTasks();
  },

  getTasksByProject: async (projectId) => {
    await delay(150);
    const tasks = getStoredTasks();
    return tasks.filter((t) => t.projectId === projectId);
  },

  getTaskById: async (id) => {
    await delay(100);
    const tasks = getStoredTasks();
    const task = tasks.find((t) => t.id === id);
    if (!task) throw new Error('Task not found');
    return task;
  },

  createTask: async (taskData) => {
    await delay(200);
    const tasks = getStoredTasks();
    const newTask = {
      id: `task-${Date.now()}`,
      projectId: taskData.projectId || 'proj-1',
      columnId: taskData.columnId || 'col-todo',
      title: taskData.title.trim(),
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      assigneeId: taskData.assigneeId || 'user-demo',
      labels: taskData.labels || ['General'],
      startDate: taskData.startDate || new Date().toISOString().split('T')[0],
      dueDate: taskData.dueDate || '',
      estimateHours: Number(taskData.estimateHours) || 0,
      loggedHours: 0,
      subtasks: taskData.subtasks || [],
      commentsCount: 0,
      attachmentsCount: 0,
      order: tasks.length,
      createdAt: new Date().toISOString(),
    };

    tasks.unshift(newTask);
    storage.set('tasks', tasks);
    return newTask;
  },

  updateTask: async (id, updates) => {
    await delay(150);
    const tasks = getStoredTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Task not found');

    tasks[index] = { ...tasks[index], ...updates };
    storage.set('tasks', tasks);
    return tasks[index];
  },

  deleteTask: async (id) => {
    await delay(150);
    const tasks = getStoredTasks();
    const filtered = tasks.filter((t) => t.id !== id);
    storage.set('tasks', filtered);
    return true;
  },

  // Batch update task orders or columns (for Drag & Drop)
  reorderTasks: async (updatedTasks) => {
    // Optimistic persistence
    storage.set('tasks', updatedTasks);
    return updatedTasks;
  },
};
