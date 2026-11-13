import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Plus,
  Search,
  LayoutGrid,
  List as ListIcon,
  Star,
  MoreVertical,
  Edit2,
  Copy,
  Archive,
  Trash2,
  Calendar,
  Users,
} from 'lucide-react';
import {
  Card,
  Button,
  Input,
  Select,
  Badge,
  ProgressBar,
  AvatarGroup,
  Dropdown,
  DropdownItem,
  DropdownDivider,
  ConfirmDialog,
  EmptyState,
  notify,
} from '../../components/ui';
import { projectService } from '../../services/projectService';
import { ProjectModal } from './ProjectModal';
import { INITIAL_USERS } from '../../data/seedData';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name'); // 'name' | 'dueDate' | 'progress'

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch {
      notify.error('Failed to load projects');
    }
  };

  const handleToggleFavorite = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const isFav = await projectService.toggleFavorite(id);
      setProjects(
        projects.map((p) => (p.id === id ? { ...p, isFavorite: isFav } : p))
      );
      notify.success(isFav ? 'Added to favorites' : 'Removed from favorites');
    } catch {
      // Revert if error
    }
  };

  const handleSaveProject = async (formData) => {
    try {
      if (editingProject) {
        const updated = await projectService.updateProject(editingProject.id, formData);
        setProjects(projects.map((p) => (p.id === editingProject.id ? updated : p)));
        notify.success('Project updated successfully!');
      } else {
        const created = await projectService.createProject(formData);
        setProjects([created, ...projects]);
        notify.success('Project created successfully!');
      }
    } catch (err) {
      notify.error(err.message || 'Operation failed');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const dup = await projectService.duplicateProject(id);
      setProjects([dup, ...projects]);
      notify.success('Project duplicated!');
    } catch {
      notify.error('Failed to duplicate project');
    }
  };

  const handleArchive = async (id) => {
    try {
      await projectService.updateProject(id, { status: 'archived' });
      setProjects(projects.map((p) => (p.id === id ? { ...p, status: 'archived' } : p)));
      notify.success('Project archived');
    } catch {
      notify.error('Failed to archive project');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await projectService.deleteProject(deleteTargetId);
      setProjects(projects.filter((p) => p.id !== deleteTargetId));
      notify.success('Project deleted successfully');
    } catch {
      notify.error('Failed to delete project');
    } finally {
      setDeleteTargetId(null);
    }
  };

  // Filter and sort
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const matchSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchSearch && matchStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'progress') return b.progress - a.progress;
        if (sortBy === 'dueDate') return (a.dueDate || '').localeCompare(b.dueDate || '');
        return 0;
      });
  }, [projects, searchQuery, statusFilter, sortBy]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Projects Portfolio
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Manage product initiatives, track sprint progress, and assign contributors.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={Plus}
          onClick={() => {
            setEditingProject(null);
            setIsModalOpen(true);
          }}
        >
          Create Project
        </Button>
      </div>

      {/* 2. Controls & Search Bar */}
      <Card className="p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="w-full md:w-72">
          <Input
            placeholder="Search projects..."
            leftIcon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters and View Mode */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <div className="w-36">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { label: 'All Statuses', value: 'all' },
                { label: 'In Progress', value: 'in-progress' },
                { label: 'Active', value: 'active' },
                { label: 'Completed', value: 'completed' },
                { label: 'Archived', value: 'archived' },
              ]}
            />
          </div>

          <div className="w-36">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { label: 'Sort: Name', value: 'name' },
                { label: 'Sort: Progress', value: 'progress' },
                { label: 'Sort: Due Date', value: 'dueDate' },
              ]}
            />
          </div>

          {/* Grid / List switcher */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-subtle'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-subtle'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
              aria-label="List view"
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* 3. Projects List / Grid Content */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description="Try adjusting your search criteria or create your next project."
          actionLabel="Create Project"
          onAction={() => {
            setEditingProject(null);
            setIsModalOpen(true);
          }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <Card
              key={proj.id}
              className="p-5 flex flex-col justify-between hover:shadow-soft-md transition-all group relative border-t-4"
              style={{ borderTopColor: proj.color }}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{proj.icon}</span>
                    <div>
                      <Link
                        to={`/app/projects/${proj.id}`}
                        className="text-sm font-bold text-slate-900 dark:text-white hover:text-brand-600 transition-colors"
                      >
                        {proj.name}
                      </Link>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Due {proj.dueDate || 'Ongoing'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleToggleFavorite(e, proj.id)}
                      className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                        proj.isFavorite ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'
                      }`}
                      aria-label="Favorite project"
                    >
                      <Star className={`h-4 w-4 ${proj.isFavorite ? 'fill-current' : ''}`} />
                    </button>

                    <Dropdown
                      align="right"
                      trigger={
                        <button
                          type="button"
                          className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      }
                    >
                      <DropdownItem
                        icon={Edit2}
                        onClick={() => {
                          setEditingProject(proj);
                          setIsModalOpen(true);
                        }}
                      >
                        Edit Details
                      </DropdownItem>
                      <DropdownItem icon={Copy} onClick={() => handleDuplicate(proj.id)}>
                        Duplicate Project
                      </DropdownItem>
                      <DropdownItem icon={Archive} onClick={() => handleArchive(proj.id)}>
                        Archive Project
                      </DropdownItem>
                      <DropdownDivider />
                      <DropdownItem
                        icon={Trash2}
                        danger
                        onClick={() => setDeleteTargetId(proj.id)}
                      >
                        Delete Project
                      </DropdownItem>
                    </Dropdown>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              {/* Progress & Members Footer */}
              <div className="mt-5 space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <ProgressBar value={proj.progress} size="sm" showLabel />

                <div className="flex items-center justify-between pt-1">
                  <AvatarGroup users={INITIAL_USERS.slice(0, 3)} size="xs" max={3} />
                  <Link
                    to={`/app/projects/${proj.id}`}
                    className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    Open Board &rarr;
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <Card className="overflow-hidden">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={(e) => handleToggleFavorite(e, proj.id)}
                    className={proj.isFavorite ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}
                  >
                    <Star className={`h-4 w-4 ${proj.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <span className="text-xl">{proj.icon}</span>
                  <div className="min-w-0">
                    <Link
                      to={`/app/projects/${proj.id}`}
                      className="text-xs font-bold text-slate-900 dark:text-white hover:text-brand-600 truncate block"
                    >
                      {proj.name}
                    </Link>
                    <p className="text-[11px] text-slate-400 truncate max-w-md">
                      {proj.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0 text-xs">
                  <Badge variant={proj.status === 'completed' ? 'success' : 'primary'} size="sm">
                    {proj.status}
                  </Badge>

                  <div className="w-24 hidden sm:block">
                    <ProgressBar value={proj.progress} size="xs" />
                  </div>

                  <span className="text-slate-400 text-[11px] hidden md:block">
                    {proj.dueDate || 'Ongoing'}
                  </span>

                  <AvatarGroup users={INITIAL_USERS.slice(0, 3)} size="xs" max={2} />

                  <Dropdown
                    align="right"
                    trigger={
                      <button type="button" className="p-1 rounded text-slate-400 hover:text-slate-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    }
                  >
                    <DropdownItem
                      icon={Edit2}
                      onClick={() => {
                        setEditingProject(proj);
                        setIsModalOpen(true);
                      }}
                    >
                      Edit Details
                    </DropdownItem>
                    <DropdownItem icon={Copy} onClick={() => handleDuplicate(proj.id)}>
                      Duplicate
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem icon={Trash2} danger onClick={() => setDeleteTargetId(proj.id)}>
                      Delete
                    </DropdownItem>
                  </Dropdown>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Project Create/Edit Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        project={editingProject}
      />

      {/* Confirm Deletion Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Delete this project?"
        message="This will permanently delete the project and all tasks associated with it. This action cannot be undone."
        confirmLabel="Delete Project"
      />
    </div>
  );
}
