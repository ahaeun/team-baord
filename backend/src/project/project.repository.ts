import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { RedisService } from '../redis/redis.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectStatus } from './project-status.enum';

export interface ProjectRecord {
  id: string;
  teamId: string;
  name: string;
  startDate?: string;
  memo?: string;
  status: ProjectStatus;
  createdAt: string;
}

@Injectable()
export class ProjectRepository {
  constructor(private readonly redis: RedisService) {}

  private key(id: string) {
    return `project:${id}`;
  }

  private teamProjectsKey(teamId: string) {
    return `team:${teamId}:projects`;
  }

  async create(dto: CreateProjectDto): Promise<ProjectRecord> {
    const record: ProjectRecord = {
      id: randomUUID(),
      teamId: dto.teamId,
      name: dto.name,
      startDate: dto.startDate,
      memo: dto.memo,
      status: dto.status ?? ProjectStatus.IN_DEVELOPMENT,
      createdAt: new Date().toISOString(),
    };

    await this.redis.client.hset(this.key(record.id), this.toHash(record));
    await this.redis.client.sadd(this.teamProjectsKey(record.teamId), record.id);

    return record;
  }

  async findAllByTeam(teamId: string): Promise<ProjectRecord[]> {
    const ids = await this.redis.client.smembers(this.teamProjectsKey(teamId));
    const records = await Promise.all(ids.map((id) => this.findById(id)));
    return records
      .filter((record): record is ProjectRecord => record !== null)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async findById(id: string): Promise<ProjectRecord | null> {
    const data = await this.redis.client.hgetall(this.key(id));
    if (!data.id) return null;
    return this.fromHash(data);
  }

  async update(id: string, dto: UpdateProjectDto): Promise<ProjectRecord | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated: ProjectRecord = {
      ...existing,
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.startDate !== undefined && { startDate: dto.startDate }),
      ...(dto.memo !== undefined && { memo: dto.memo }),
      ...(dto.status !== undefined && { status: dto.status }),
    };

    await this.redis.client.hset(this.key(id), this.toHash(updated));
    return updated;
  }

  async remove(id: string): Promise<void> {
    const existing = await this.findById(id);
    if (!existing) return;

    await this.redis.client.del(this.key(id));
    await this.redis.client.srem(this.teamProjectsKey(existing.teamId), id);
  }

  async removeAllByTeam(teamId: string): Promise<void> {
    const projects = await this.findAllByTeam(teamId);
    await Promise.all(projects.map((project) => this.remove(project.id)));
    await this.redis.client.del(this.teamProjectsKey(teamId));
  }

  private toHash(record: ProjectRecord): Record<string, string> {
    return {
      id: record.id,
      teamId: record.teamId,
      name: record.name,
      startDate: record.startDate ?? '',
      memo: record.memo ?? '',
      status: record.status,
      createdAt: record.createdAt,
    };
  }

  private fromHash(data: Record<string, string>): ProjectRecord {
    return {
      id: data.id,
      teamId: data.teamId,
      name: data.name,
      startDate: data.startDate || undefined,
      memo: data.memo || undefined,
      status: (data.status as ProjectStatus) || ProjectStatus.IN_DEVELOPMENT,
      createdAt: data.createdAt,
    };
  }
}
