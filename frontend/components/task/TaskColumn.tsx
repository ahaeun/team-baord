'use client';

import type { Task, TaskStatus } from '@/types/task';
import { TaskCard } from './TaskCard';
import '../../app/shared.css';

const STATUS_META: Record<TaskStatus, { label: string; color: string }> = {
  TODO: { label: '시작 전', color: '#9ca3af' },
  IN_PROGRESS: { label: '진행 중', color: '#2563eb' },
  DONE: { label: '완료', color: '#16a34a' },
};

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDropTask: (taskId: string, status: TaskStatus) => void;
}

export function TaskColumn({ status, tasks, onAddTask, onEditTask, onDropTask }: TaskColumnProps) {
  const meta = STATUS_META[status];

  return (
    <div
      className="task-column"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('text/plain');
        if (taskId) onDropTask(taskId, status);
      }}
    >
      <div className="task-column__header margin-bottom-10">
        <span className="status-dot" style={{ backgroundColor: meta.color }} />
        <span style={{ color: meta.color }}>{meta.label}</span>
        <span className="task-column__count">{tasks.length}</span>
      </div>

      <button type="button" className="task-column__add" onClick={() => onAddTask(status)}>
        + 새 페이지
      </button>

      <div className="task-column__list">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEditTask} />
        ))}
      </div>
    </div>
  );
}
