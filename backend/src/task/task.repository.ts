import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { RedisService } from '../redis/redis.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

export interface TaskRecord {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  assignee?: string;
  startDate?: string;
  dueDate?: string;
  status: TaskStatus;
}

@Injectable()
export class TaskRepository {
  constructor(private readonly redis: RedisService) {}

  private key(id: string) {
    return `task:${id}`;
  }

  private projectTasksKey(projectId: string) {
    return `project:${projectId}:tasks`;
  }

  async create(dto: CreateTaskDto): Promise<TaskRecord> {
    const record: TaskRecord = {
      id: randomUUID(),
      projectId: dto.projectId,
      title: dto.title,
      description: dto.description,
      assignee: dto.assignee,
      startDate: dto.startDate,
      dueDate: dto.dueDate,
      status: TaskStatus.TODO,
    };

    await this.redis.client.hset(this.key(record.id), this.toHash(record));
    await this.redis.client.sadd(this.projectTasksKey(record.projectId), record.id);

    return record;
  }

  async findAllByProject(projectId: string): Promise<TaskRecord[]> {
    const ids = await this.redis.client.smembers(this.projectTasksKey(projectId));
    const records = await Promise.all(ids.map((id) => this.findById(id)));
    return records.filter((record): record is TaskRecord => record !== null);
  }

  async findById(id: string): Promise<TaskRecord | null> {
    const data = await this.redis.client.hgetall(this.key(id));
    if (!data.id) return null;
    return this.fromHash(data);
  }

  async update(id: string, dto: UpdateTaskDto): Promise<TaskRecord | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated: TaskRecord = {
      ...existing,
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.assignee !== undefined && { assignee: dto.assignee }),
      ...(dto.startDate !== undefined && { startDate: dto.startDate }),
      ...(dto.dueDate !== undefined && { dueDate: dto.dueDate }),
    };

    await this.redis.client.hset(this.key(id), this.toHash(updated));
    return updated;
  }

  async updateStatus(id: string, status: TaskStatus): Promise<TaskRecord | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated: TaskRecord = { ...existing, status };
    await this.redis.client.hset(this.key(id), this.toHash(updated));
    return updated;
  }

  async remove(id: string): Promise<void> {
    const existing = await this.findById(id);
    if (!existing) return;

    await this.redis.client.del(this.key(id));
    await this.redis.client.srem(this.projectTasksKey(existing.projectId), id);
  }

  async removeAllByProject(projectId: string): Promise<void> {
    const tasks = await this.findAllByProject(projectId);
    await Promise.all(tasks.map((task) => this.remove(task.id)));
    await this.redis.client.del(this.projectTasksKey(projectId));
  }

  private toHash(record: TaskRecord): Record<string, string> {
    return {
      id: record.id,
      projectId: record.projectId,
      title: record.title,
      description: record.description ?? '',
      assignee: record.assignee ?? '',
      startDate: record.startDate ?? '',
      dueDate: record.dueDate ?? '',
      status: record.status,
    };
  }

  private fromHash(data: Record<string, string>): TaskRecord {
    return {
      id: data.id,
      projectId: data.projectId,
      title: data.title,
      description: data.description || undefined,
      assignee: data.assignee || undefined,
      startDate: data.startDate || undefined,
      dueDate: data.dueDate || undefined,
      status: (data.status as TaskStatus) || TaskStatus.TODO,
    };
  }
}
