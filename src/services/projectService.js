import { storage } from './storage';
import { INITIAL_PROJECTS, INITIAL_COLUMNS } from '../data/mockData';

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

function getStoredProjects() {
  let list = storage.get('projects');
  if (!list || !Array.isArray(list) || list.length === 0) {
    list = INITIAL_PROJECTS;
    storage.set('projects', list);
  }
  return list;
}

function getStoredColumns() {
  let cols = storage.get('columns');
  if (!cols || !Array.isArray(cols) || cols.length === 0) {
    cols = INITIAL_COLUMNS;
    storage.set('columns', cols);
  }
  return cols;
}

export const projectService = {
  getProjects: async () => {
    await delay(200);
    return getStoredProjects();
  },

  getProjectById: async (id) => {
    await delay(150);
    const projects = getStoredProjects();
    const found = projects.find((p) => p.id === id);
    if (!found) throw new Error('Project not found');
    return found;
  },

  createProject: async (projectData) => {
    await delay(300);
    const projects = getStoredProjects();
    const newProject = {
      id: `proj-${Date.now()}`,
      name: projectData.name.trim(),
      description: projectData.description || '',
      color: projectData.color || '#6366f1',
      icon: projectData.icon || '📁',
      status: projectData.status || 'in-progress',
      progress: 0,
      startDate: projectData.startDate || new Date().toISOString().split('T')[0],
      dueDate: projectData.dueDate || '',
      isFavorite: false,
      ownerId: projectData.ownerId || 'user-demo',
      members: projectData.members || ['user-demo'],
      createdAt: new Date().toISOString(),
    };

    projects.unshift(newProject);
    storage.set('projects', projects);
    return newProject;
  },

  updateProject: async (id, updates) => {
    await delay(200);
    const projects = getStoredProjects();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Project not found');

    projects[index] = { ...projects[index], ...updates };
    storage.set('projects', projects);
    return projects[index];
  },

  deleteProject: async (id) => {
    await delay(250);
    const projects = getStoredProjects();
    const filtered = projects.filter((p) => p.id !== id);
    storage.set('projects', filtered);
    return true;
  },

  duplicateProject: async (id) => {
    await delay(300);
    const projects = getStoredProjects();
    const original = projects.find((p) => p.id === id);
    if (!original) throw new Error('Project not found');

    const duplicate = {
      ...original,
      id: `proj-${Date.now()}`,
      name: `${original.name} (Copy)`,
      createdAt: new Date().toISOString(),
      isFavorite: false,
    };

    projects.unshift(duplicate);
    storage.set('projects', projects);
    return duplicate;
  },

  toggleFavorite: async (id) => {
    await delay(100);
    const projects = getStoredProjects();
    const project = projects.find((p) => p.id === id);
    if (project) {
      project.isFavorite = !project.isFavorite;
      storage.set('projects', projects);
      return project.isFavorite;
    }
    return false;
  },

  getColumns: async () => {
    await delay(100);
    return getStoredColumns();
  },

  updateColumns: async (columns) => {
    await delay(100);
    storage.set('columns', columns);
    return columns;
  },
};
