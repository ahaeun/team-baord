import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository, TaskRecord } from './task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  create(dto: CreateTaskDto): Promise<TaskRecord> {
    return this.taskRepository.create(dto);
  }

  findAllByProject(projectId: string): Promise<TaskRecord[]> {
    return this.taskRepository.findAllByProject(projectId);
  }

  async update(id: string, dto: UpdateTaskDto): Promise<TaskRecord> {
    const updated = await this.taskRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`Task not found: ${id}`);
    }
    return updated;
  }

  async updateStatus(id: string, dto: UpdateTaskStatusDto): Promise<TaskRecord> {
    const updated = await this.taskRepository.updateStatus(id, dto.status);
    if (!updated) {
      throw new NotFoundException(`Task not found: ${id}`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.taskRepository.remove(id);
  }

  removeAllByProject(projectId: string): Promise<void> {
    return this.taskRepository.removeAllByProject(projectId);
  }
}
