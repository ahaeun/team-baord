import type { Task } from '@/types/task';

interface TaskBoardProps {
  projectId: string;
  tasks: Task[];
}

export function TaskBoard({ projectId, tasks }: TaskBoardProps) {
  // TODO: implement 3-column layout (TODO / IN_PROGRESS / DONE) using TaskColumn
  return null;
}
