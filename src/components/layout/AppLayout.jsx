import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { CommandPalette } from './CommandPalette';
import { CreateModal } from './CreateModal';
import { ShortcutsModal } from './ShortcutsModal';
import { Drawer } from '../ui';
import { useHotkeys } from '../../hooks/useHotkeys';

export function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createType, setCreateType] = useState('task');
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Global hotkeys
  useHotkeys('k', () => setIsCommandPaletteOpen((prev) => !prev), { ctrlOrMeta: true });
  useHotkeys('?', () => setIsShortcutsOpen((prev) => !prev));
  useHotkeys('c', () => {
    setCreateType('task');
    setIsCreateModalOpen(true);
  });
  useHotkeys('p', () => {
    setCreateType('project');
    setIsCreateModalOpen(true);
  });

  const handleOpenCreateTask = () => {
    setCreateType('task');
    setIsCreateModalOpen(true);
  };

  const handleOpenCreateProject = () => {
    setCreateType('project');
    setIsCreateModalOpen(true);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      <Drawer
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        side="left"
        width="sm"
        className="!p-0 !max-w-[280px]"
      >
        <Sidebar
          isCollapsed={false}
          isMobile={true}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />
      </Drawer>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Navbar */}
        <Navbar
          onToggleSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenCreateTask={handleOpenCreateTask}
          onOpenCreateProject={handleOpenCreateProject}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
        />

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fadeIn">
          <Outlet />
        </main>
      </div>

      {/* Global Modals */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenCreateTask={handleOpenCreateTask}
        onOpenCreateProject={handleOpenCreateProject}
      />

      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        initialType={createType}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
