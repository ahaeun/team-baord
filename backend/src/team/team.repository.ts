import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { RedisService } from '../redis/redis.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

export interface TeamRecord {
  id: string;
  name: string;
  createdAt: string;
}

const TEAM_IDS_KEY = 'team:ids';

@Injectable()
export class TeamRepository {
  constructor(private readonly redis: RedisService) {}

  private key(id: string) {
    return `team:${id}`;
  }

  async create(dto: CreateTeamDto): Promise<TeamRecord> {
    const record: TeamRecord = {
      id: randomUUID(),
      name: dto.name,
      createdAt: new Date().toISOString(),
    };

    await this.redis.client.hset(this.key(record.id), record);
    await this.redis.client.sadd(TEAM_IDS_KEY, record.id);

    return record;
  }

  async findAll(): Promise<TeamRecord[]> {
    const ids = await this.redis.client.smembers(TEAM_IDS_KEY);
    const records = await Promise.all(ids.map((id) => this.findById(id)));
    return records
      .filter((record): record is TeamRecord => record !== null)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async findById(id: string): Promise<TeamRecord | null> {
    const data = await this.redis.client.hgetall(this.key(id));
    if (!data.id) return null;
    return data as unknown as TeamRecord;
  }

  async update(id: string, dto: UpdateTeamDto): Promise<TeamRecord | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated: TeamRecord = {
      ...existing,
      ...(dto.name !== undefined && { name: dto.name }),
    };

    await this.redis.client.hset(this.key(id), updated);
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.redis.client.del(this.key(id));
    await this.redis.client.srem(TEAM_IDS_KEY, id);
  }
}
