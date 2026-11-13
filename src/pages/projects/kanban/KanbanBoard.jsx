import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Plus,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Trash2,
  Edit2,
  Sparkles,
  Columns,
} from 'lucide-react';
import { TaskCard } from './TaskCard';
import {
  Button,
  Badge,
  Dropdown,
  DropdownItem,
  DropdownDivider,
  Modal,
  Input,
  notify,
} from '../../../components/ui';

export function KanbanBoard({
  columns,
  tasks,
  onTaskMove,
  onOpenTaskDetail,
  onQuickCreateTask,
  onAddColumn,
  onDeleteColumn,
  onRenameColumn,
}) {
  const [quickAddColumnId, setQuickAddColumnId] = useState(null);
  const [quickTitle, setQuickTitle] = useState('');
  const [collapsedColumns, setCollapsedColumns] = useState({});
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

  const toggleCollapse = (columnId) => {
    setCollapsedColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    onTaskMove(draggableId, source, destination);
  };

  const submitQuickAdd = (columnId) => {
    if (!quickTitle.trim()) {
      setQuickAddColumnId(null);
      return;
    }

    onQuickCreateTask({
      title: quickTitle,
      columnId,
    });
    setQuickTitle('');
    setQuickAddColumnId(null);
  };

  const submitNewColumn = (e) => {
    e.preventDefault();
    if (!newColumnName.trim()) return;
    onAddColumn(newColumnName.trim());
    setNewColumnName('');
    setIsAddColumnOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2 items-start min-h-[600px] no-scrollbar">
          {columns.map((column) => {
            const columnTasks = tasks
              .filter((t) => t.columnId === column.id)
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            const isCollapsed = collapsedColumns[column.id];

            return (
              <div
                key={column.id}
                className={`rounded-2xl border border-slate-200/90 bg-slate-100/70 p-3 flex flex-col dark:border-slate-800 dark:bg-slate-900/60 shrink-0 transition-all ${
                  isCollapsed ? 'w-14 items-center' : 'w-72 sm:w-80'
                }`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between w-full mb-3 px-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: column.color || '#6366f1' }}
                    />
                    {!isCollapsed && (
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {column.title}
                      </h3>
                    )}
                    <Badge variant="default" size="sm" className="font-bold">
                      {columnTasks.length}
                    </Badge>
                  </div>

                  {!isCollapsed && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setQuickAddColumnId(column.id)}
                        className="p-1 rounded text-slate-400 hover:bg-white hover:text-slate-700 dark:hover:bg-slate-800"
                        title="Add task to column"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>

                      <Dropdown
                        align="right"
                        trigger={
                          <button
                            type="button"
                            className="p-1 rounded text-slate-400 hover:bg-white hover:text-slate-700 dark:hover:bg-slate-800"
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                          </button>
                        }
                      >
                        <DropdownItem
                          icon={ChevronRight}
                          onClick={() => toggleCollapse(column.id)}
                        >
                          Collapse Column
                        </DropdownItem>
                        <DropdownItem
                          icon={Edit2}
                          onClick={() => {
                            const newTitle = prompt('Rename column:', column.title);
                            if (newTitle) onRenameColumn(column.id, newTitle);
                          }}
                        >
                          Rename Column
                        </DropdownItem>
                        <DropdownDivider />
                        <DropdownItem
                          icon={Trash2}
                          danger
                          onClick={() => onDeleteColumn(column.id)}
                        >
                          Delete Column
                        </DropdownItem>
                      </Dropdown>
                    </div>
                  )}
                </div>

                {/* Collapsed state click-to-expand */}
                {isCollapsed ? (
                  <button
                    type="button"
                    onClick={() => toggleCollapse(column.id)}
                    className="py-12 writing-vertical-lr text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  >
                    {column.title}
                  </button>
                ) : (
                  <>
                    {/* Quick Add Input in column */}
                    {quickAddColumnId === column.id && (
                      <div className="mb-3 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-brand-500 shadow-soft">
                        <input
                          type="text"
                          placeholder="Task title..."
                          autoFocus
                          value={quickTitle}
                          onChange={(e) => setQuickTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') submitQuickAdd(column.id);
                            if (e.key === 'Escape') setQuickAddColumnId(null);
                          }}
                          className="w-full text-xs bg-transparent focus:outline-none dark:text-white"
                        />
                        <div className="flex justify-end gap-1.5 mt-2">
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => setQuickAddColumnId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="primary"
                            size="xs"
                            onClick={() => submitQuickAdd(column.id)}
                          >
                            Add Card
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Droppable Task List */}
                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`flex-1 flex flex-col gap-2.5 min-h-[150px] p-0.5 rounded-xl transition-colors ${
                            snapshot.isDraggingOver
                              ? 'bg-brand-50/50 dark:bg-brand-950/20 ring-2 ring-brand-500/20'
                              : ''
                          }`}
                        >
                          {columnTasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(dragProvided, dragSnapshot) => (
                                <div
                                  ref={dragProvided.innerRef}
                                  {...dragProvided.draggableProps}
                                  {...dragProvided.dragHandleProps}
                                >
                                  <TaskCard
                                    task={task}
                                    onOpenDetail={onOpenTaskDetail}
                                    isDragging={dragSnapshot.isDragging}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    {/* Bottom Quick-Add Card Button */}
                    {quickAddColumnId !== column.id && (
                      <button
                        type="button"
                        onClick={() => setQuickAddColumnId(column.id)}
                        className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl border border-dashed border-slate-300 text-xs font-semibold text-slate-500 hover:border-brand-500 hover:text-brand-600 hover:bg-white dark:border-slate-800 dark:hover:bg-slate-900 transition-all cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Card</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            );
          })}

          {/* Add Column Button */}
          <button
            type="button"
            onClick={() => setIsAddColumnOpen(true)}
            className="w-72 h-16 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-brand-500 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 hover:text-brand-600 shrink-0 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Column
          </button>
        </div>
      </DragDropContext>

      {/* Add Column Modal */}
      <Modal
        isOpen={isAddColumnOpen}
        onClose={() => setIsAddColumnOpen(false)}
        title="Create New Column"
        description="Add a new custom state to your Kanban workflow."
        footer={
          <>
            <Button variant="outline" size="md" onClick={() => setIsAddColumnOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={submitNewColumn}>
              Create Column
            </Button>
          </>
        }
      >
        <form onSubmit={submitNewColumn} className="space-y-4">
          <Input
            label="Column Name"
            placeholder="e.g. QA Verification, Blocked"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            required
            autoFocus
          />
        </form>
      </Modal>
    </div>
  );
}
