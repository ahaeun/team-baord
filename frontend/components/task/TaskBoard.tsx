'use client';

import { useState } from 'react';
import type { Task, TaskStatus } from '@/types/task';
import { TaskColumn } from './TaskColumn';
import { TaskForm } from './TaskForm';
import { createTask, deleteTask, fetchTasksByProject, updateTask, updateTaskStatus } from '@/lib/api/task';

const STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

interface TaskBoardProps {
  projectId: string;
  tasks: Task[];
}

export function TaskBoard({ projectId, tasks: initialTasks }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [addingStatus, setAddingStatus] = useState<TaskStatus | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const refresh = () => fetchTasksByProject(projectId).then(setTasks);

  const openCreateModal = (status: TaskStatus) => {
    setEditingTask(null);
    setAddingStatus(status);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setAddingStatus(task.status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setAddingStatus(null);
  };

  const handleSubmit = async (input: {
    title: string;
    description?: string;
    status: TaskStatus;
    startDate?: string;
    dueDate?: string;
  }) => {
    if (editingTask) {
      await updateTask(editingTask.id, {
        title: input.title,
        description: input.description,
        startDate: input.startDate,
        dueDate: input.dueDate,
      });
      if (input.status !== editingTask.status) {
        await updateTaskStatus(editingTask.id, input.status);
      }
    } else {
      const created = await createTask({
        projectId,
        title: input.title,
        description: input.description,
        startDate: input.startDate,
        dueDate: input.dueDate,
      });
      if (input.status !== 'TODO') {
        await updateTaskStatus(created.id, input.status);
      }
    }
    await refresh();
    closeModal();
  };

  const handleDelete = async (task: Task) => {
    if (!window.confirm('삭제하시겠습니까?')) return;
    await deleteTask(task.id);
    await refresh();
    closeModal();
  };

  const handleDropTask = async (taskId: string, status: TaskStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === status) return;

    await updateTaskStatus(taskId, status);
    await refresh();
  };

  return (
    <>
      <div className="task-board">
        {STATUSES.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks.filter((t) => t.status === status)}
            onAddTask={openCreateModal}
            onEditTask={openEditModal}
            onDropTask={handleDropTask}
          />
        ))}
      </div>

      {isModalOpen && addingStatus && (
        <TaskForm
          task={editingTask}
          defaultStatus={addingStatus}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          onCancel={closeModal}
        />
      )}
    </>
  );
}
