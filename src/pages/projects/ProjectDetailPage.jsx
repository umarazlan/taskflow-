import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Kanban as KanbanIcon,
  List as ListIcon,
  Calendar,
  Layers,
  Paperclip,
  Activity,
  Star,
  Plus,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import {
  Button,
  Badge,
  Tabs,
  ProgressBar,
  AvatarGroup,
  Drawer,
  notify,
} from '../../components/ui';
import { projectService } from '../../services/projectService';
import { taskService } from '../../services/taskService';
import { KanbanBoard } from './kanban/KanbanBoard';
import { ProjectListView } from './tabs/ProjectListView';
import { ProjectTimelineView } from './tabs/ProjectTimelineView';
import { ProjectOverviewTab } from './tabs/ProjectOverviewTab';
import { ProjectFilesTab } from './tabs/ProjectFilesTab';
import { ProjectActivityTab } from './tabs/ProjectActivityTab';
import { INITIAL_USERS } from '../../data/seedData';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('board');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProjectData() {
      try {
        const [proj, cols, allTasks] = await Promise.all([
          projectService.getProjectById(id || 'proj-1'),
          projectService.getColumns(),
          taskService.getTasksByProject(id || 'proj-1'),
        ]);
        setProject(proj);
        setColumns(cols);
        setTasks(allTasks);
      } catch (err) {
        notify.error('Project not found');
        navigate('/app/projects');
      } finally {
        setIsLoading(false);
      }
    }
    loadProjectData();
  }, [id, navigate]);

  // Drag and drop task move handler
  const handleTaskMove = async (taskId, source, destination) => {
    const updatedTasks = [...tasks];
    const taskIndex = updatedTasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;

    // Change column and order optimistically
    const movedTask = {
      ...updatedTasks[taskIndex],
      columnId: destination.droppableId,
      order: destination.index,
    };

    updatedTasks.splice(taskIndex, 1);
    updatedTasks.splice(destination.index, 0, movedTask);

    setTasks(updatedTasks);
    await taskService.reorderTasks(updatedTasks);
  };

  const handleQuickCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask({
        ...taskData,
        projectId: project.id,
      });
      setTasks([...tasks, newTask]);
      notify.success('Card added to column!');
    } catch {
      notify.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const updated = await taskService.updateTask(taskId, updates);
      setTasks(tasks.map((t) => (t.id === taskId ? updated : t)));
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask(updated);
      }
    } catch {
      notify.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
      setSelectedTask(null);
      notify.success('Task deleted');
    } catch {
      notify.error('Failed to delete task');
    }
  };

  const handleToggleFavorite = async () => {
    if (!project) return;
    try {
      const isFav = await projectService.toggleFavorite(project.id);
      setProject({ ...project, isFavorite: isFav });
      notify.success(isFav ? 'Added to favorites' : 'Removed from favorites');
    } catch {
      // Revert if error
    }
  };

  const handleAddColumn = async (title) => {
    const newCol = {
      id: `col-${Date.now()}`,
      title,
      color: '#6366f1',
    };
    const updated = [...columns, newCol];
    setColumns(updated);
    await projectService.updateColumns(updated);
    notify.success(`Column "${title}" created!`);
  };

  const handleDeleteColumn = async (columnId) => {
    if (window.confirm('Delete this column and its associated tasks?')) {
      const updated = columns.filter((c) => c.id !== columnId);
      setColumns(updated);
      await projectService.updateColumns(updated);
      notify.success('Column deleted');
    }
  };

  const handleRenameColumn = async (columnId, newTitle) => {
    const updated = columns.map((c) => (c.id === columnId ? { ...c, title: newTitle } : c));
    setColumns(updated);
    await projectService.updateColumns(updated);
    notify.success('Column renamed');
  };

  if (isLoading || !project) {
    return (
      <div className="py-20 text-center text-xs text-slate-400">
        Loading project board...
      </div>
    );
  }

  const tabsConfig = [
    { id: 'board', label: 'Board (Kanban)', icon: KanbanIcon, count: tasks.length },
    { id: 'list', label: 'List View', icon: ListIcon },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'files', label: 'Files', icon: Paperclip },
    { id: 'activity', label: 'Activity', icon: Activity },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Project Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <Link
            to="/app/projects"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            title="Back to all projects"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <span className="text-3xl">{project.icon}</span>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {project.name}
              </h1>
              <button
                type="button"
                onClick={handleToggleFavorite}
                className={project.isFavorite ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}
                title="Star project"
              >
                <Star className={`h-4.5 w-4.5 ${project.isFavorite ? 'fill-current' : ''}`} />
              </button>
              <Badge variant="primary" size="sm" dot>
                {project.status}
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-xl">
              {project.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AvatarGroup users={INITIAL_USERS.slice(0, 4)} size="sm" max={3} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              notify.success('Project link copied to clipboard!');
            }}
            leftIcon={Share2}
          >
            Share
          </Button>
        </div>
      </div>

      {/* 2. Tabs Switcher */}
      <div className="overflow-x-auto no-scrollbar">
        <Tabs
          tabs={tabsConfig}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="underline"
        />
      </div>

      {/* 3. Tab Contents */}
      <div className="pt-2">
        {activeTab === 'board' && (
          <KanbanBoard
            columns={columns}
            tasks={tasks}
            onTaskMove={handleTaskMove}
            onOpenTaskDetail={setSelectedTask}
            onQuickCreateTask={handleQuickCreateTask}
            onAddColumn={handleAddColumn}
            onDeleteColumn={handleDeleteColumn}
            onRenameColumn={handleRenameColumn}
          />
        )}

        {activeTab === 'list' && (
          <ProjectListView
            tasks={tasks}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onOpenTaskDetail={setSelectedTask}
          />
        )}

        {activeTab === 'timeline' && (
          <ProjectTimelineView
            tasks={tasks}
            onOpenTaskDetail={setSelectedTask}
          />
        )}

        {activeTab === 'overview' && (
          <ProjectOverviewTab
            project={project}
            tasks={tasks}
          />
        )}

        {activeTab === 'files' && (
          <ProjectFilesTab />
        )}

        {activeTab === 'activity' && (
          <ProjectActivityTab />
        )}
      </div>

      {/* Task Detail Drawer Preview (Full rich drawer in Phase 5) */}
      <Drawer
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.title || 'Task Details'}
        description={`Project: ${project.name}`}
        width="lg"
      >
        {selectedTask && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Badge variant="primary" dot>{selectedTask.status}</Badge>
              <Badge variant="warning">{selectedTask.priority} priority</Badge>
              {selectedTask.dueDate && (
                <span className="text-xs text-slate-500">Due {selectedTask.dueDate}</span>
              )}
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Description
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                {selectedTask.description || 'No description provided.'}
              </p>
            </div>

            {/* Checklist */}
            {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Subtasks Checklist ({selectedTask.subtasks.filter((s) => s.completed).length}/{selectedTask.subtasks.length})
                </h4>
                <div className="space-y-1.5">
                  {selectedTask.subtasks.map((sub, i) => (
                    <div key={sub.id || i} className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={sub.completed}
                        onChange={() => {
                          const updatedSubs = [...selectedTask.subtasks];
                          updatedSubs[i].completed = !updatedSubs[i].completed;
                          handleUpdateTask(selectedTask.id, { subtasks: updatedSubs });
                        }}
                        className="rounded border-slate-300 text-brand-600"
                      />
                      <span className={sub.completed ? 'line-through text-slate-400' : ''}>
                        {sub.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between">
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteTask(selectedTask.id)}
              >
                Delete Task
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedTask(null)}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
