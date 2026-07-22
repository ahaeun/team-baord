import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { RedisService } from '../redis/redis.service';

const SESSION_TTL_SECONDS = Number(process.env.SESSION_TTL_SECONDS ?? 60 * 60 * 24 * 7);

@Injectable()
export class SessionService {
  constructor(private readonly redis: RedisService) {}

  private key(sessionId: string) {
    return `session:${sessionId}`;
  }

  async create(userId: string): Promise<string> {
    const sessionId = randomUUID();
    await this.redis.client.set(this.key(sessionId), userId, 'EX', SESSION_TTL_SECONDS);
    return sessionId;
  }

  async getUserId(sessionId: string): Promise<string | null> {
    return this.redis.client.get(this.key(sessionId));
  }

  async destroy(sessionId: string): Promise<void> {
    await this.redis.client.del(this.key(sessionId));
  }
}
