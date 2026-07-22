import type { Task, TaskStatus } from '@/types/task';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export async function fetchTasksByProject(projectId: string): Promise<Task[]> {
  throw new Error('TODO: implement');
}

export async function createTask(input: Omit<Task, 'id' | 'status'>): Promise<Task> {
  throw new Error('TODO: implement');
}

export async function updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
  throw new Error('TODO: implement');
}
