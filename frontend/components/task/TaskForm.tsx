'use client';

import { Fragment, useEffect, useState } from 'react';
import type { Task, TaskStatus } from '@/types/task';

interface TaskFormProps {
  task: Task | null;
  defaultStatus: TaskStatus;
  onSubmit: (input: {
    title: string;
    description?: string;
    status: TaskStatus;
    startDate?: string;
    dueDate?: string;
  }) => void;
  onDelete?: (task: Task) => void;
  onCancel: () => void;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'TODO', label: '시작 전' },
  { value: 'IN_PROGRESS', label: '진행 중' },
  { value: 'DONE', label: '완료' },
];

export function TaskForm({ task, defaultStatus, onSubmit, onDelete, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? defaultStatus);
  const [startDate, setStartDate] = useState(task?.startDate ?? '');
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '');

  useEffect(() => {
    setTitle(task?.title ?? '');
    setDescription(task?.description ?? '');
    setStatus(task?.status ?? defaultStatus);
    setStartDate(task?.startDate ?? '');
    setDueDate(task?.dueDate ?? '');
  }, [task, defaultStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (task && !window.confirm('수정하시겠습니까?')) {
      return;
    }

    onSubmit({
      title,
      description: description || undefined,
      status,
      startDate: startDate || undefined,
      dueDate: dueDate || undefined,
    });
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="cir-note" role="status" aria-live="polite">
            <span></span>
            <div className="cir-note__body margin-top-20">
              <p className="cir-note__t">제목</p>
              <p className="cir-note__d">
                <label className="cir-search margin-bottom-20">
                  <input
                    className="cir-search__field"
                    type="search"
                    placeholder="Please enter a title."
                    aria-label="Search"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </label>
              </p>

              <p className="cir-note__t">상태</p>
              <div className="cir-note__d">
                <div className="cir-tabs margin-bottom-20" role="tablist" aria-label="상태">
                  {STATUS_OPTIONS.map((option) => (
                    <Fragment key={option.value}>
                      <input
                        className="cir-tabs__r"
                        type="radio"
                        name="task-status"
                        id={`task-status-${option.value}`}
                        checked={status === option.value}
                        onChange={() => setStatus(option.value)}
                      />
                      <label className="cir-tabs__t" htmlFor={`task-status-${option.value}`} role="tab">
                        {option.label}
                      </label>
                    </Fragment>
                  ))}
                </div>
              </div>

              <p className="cir-note__t">시작일</p>
              <p className="cir-note__d">
                <label className="cir-search margin-bottom-20">
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </label>
              </p>

              <p className="cir-note__t">종료일</p>
              <p className="cir-note__d">
                <label className="cir-search margin-bottom-20">
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </label>
              </p>

              <p className="cir-note__t">개발 사항</p>
              <p className="cir-note__d">
                <label className="cir-search margin-bottom-20 textarea">
                  <textarea
                    className="cir-search__field textarea"
                    placeholder="Please enter the development details."
                    aria-label="Search"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </label>
              </p>
            </div>

            <button type="submit" className="cir-search__kbd project-modal-btn">
              {task ? 'EDIT' : 'ADD'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="cir-search__kbd project-modal-btn margin-bottom-20 cancel-btn"
            >
              CANCEL
            </button>
            {task && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(task)}
                className="cir-search__kbd project-modal-btn margin-bottom-20 task-form-delete"
              >
                DELETE
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
