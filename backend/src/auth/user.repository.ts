import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { RedisService } from '../redis/redis.service';
import { OAuthProfile } from './providers/oauth-provider.interface';

export interface User {
  id: string;
  provider: 'naver' | 'slack';
  providerId: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
}

@Injectable()
export class UserRepository {
  constructor(private readonly redis: RedisService) {}

  private userKey(id: string) {
    return `user:${id}`;
  }

  private providerIndexKey(provider: string, providerId: string) {
    return `user:provider:${provider}:${providerId}`;
  }

  async findById(id: string): Promise<User | null> {
    const data = await this.redis.client.hgetall(this.userKey(id));
    if (!data.id) return null;
    return this.toUser(data);
  }

  async upsertFromProfile(provider: 'naver' | 'slack', profile: OAuthProfile): Promise<User> {
    const existingId = await this.redis.client.get(this.providerIndexKey(provider, profile.providerId));
    const id = existingId ?? randomUUID();

    const user: User = {
      id,
      provider,
      providerId: profile.providerId,
      name: profile.name,
      email: profile.email,
      avatarUrl: profile.avatarUrl,
    };

    await this.redis.client.hset(this.userKey(id), {
      id: user.id,
      provider: user.provider,
      providerId: user.providerId,
      name: user.name ?? '',
      email: user.email ?? '',
      avatarUrl: user.avatarUrl ?? '',
    });
    await this.redis.client.set(this.providerIndexKey(provider, profile.providerId), id);

    return user;
  }

  private toUser(data: Record<string, string>): User {
    return {
      id: data.id,
      provider: data.provider as 'naver' | 'slack',
      providerId: data.providerId,
      name: data.name || undefined,
      email: data.email || undefined,
      avatarUrl: data.avatarUrl || undefined,
    };
  }
}
