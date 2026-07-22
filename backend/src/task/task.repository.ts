import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { TaskStatus } from './task-status.enum';

export interface TaskRecord {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  assignee?: string;
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

  // TODO: implement create/findById/findByProjectId/update/delete using this.redis.client
}
